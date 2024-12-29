from fastapi import FastAPI, HTTPException
from fastapi.responses import JSONResponse, FileResponse
from pydantic import BaseModel
import json
import torch
from transformers import AutoTokenizer, AutoModelForCausalLM
from peft import PeftConfig, PeftModel
from difflib import SequenceMatcher
import time
import httpx
import matplotlib.pyplot as plt
import re
import base64
from io import BytesIO


app = FastAPI()

# Load the model and tokenizer
print("Loading models...")
config = PeftConfig.from_pretrained("jeeldoshi/model_1b_latest", ignore_mismatched_sizes=True)
base_model = AutoModelForCausalLM.from_pretrained(
    "unsloth/llama-3.2-1b-instruct",
    device_map=None  # Ensure no auto device allocation
)
model = PeftModel.from_pretrained(base_model, "jeeldoshi/model_1b_latest")
tokenizer = AutoTokenizer.from_pretrained("unsloth/llama-3.2-1b-instruct")

device = "cpu"  # Force CPU usage
model.to(device)
torch.set_grad_enabled(False)  # Inference only

print("Models loaded successfully.")

# Load scraped data
print("Loading scraped data...")
with open('D:/SIH 2024/rag-deploy/data/final_all_data.json', 'r', encoding='utf-8') as f:
    scraped_data = json.load(f)
if scraped_data:
    print("Scraped data loaded successfully.")

# System prompt
SYSTEM_PROMPT = (
    "You are an expert AI assistant for legal and judicial queries about the Department of Justice in India. "
    "IMPORTANT INSTRUCTIONS:\n"
    "1. Only answer based on the provided context.\n"
    "2. If you cannot find relevant information, clearly state: 'I do not have sufficient information to answer this query.'\n"
    "3. Do not generate fictional or unverified information.\n"
    "4. Provide clear, concise, and factual responses.\n"
    "5. DO NOT HALLUCINATE.\n"
)

class QueryRequest(BaseModel):
    prompt: str
    feedback: str = None  # Optional feedback field (e.g., "like", "dislike")

# Function to filter out exact duplicates
def filter_redundant_data(scraped_data):
    seen = set()  # Keep track of seen content
    filtered_data = []

    for item in scraped_data:
        title = item['metadata'].get('title', '').strip().lower()
        content = item.get('text', '').strip().lower()
        
        # Use a tuple of (title, content) to detect redundancy
        if (title, content) not in seen:
            filtered_data.append(item)
            seen.add((title, content))
    
    return filtered_data

# Function to filter out similar data based on a similarity threshold
def filter_similar_data(scraped_data, threshold=0.6):
    filtered_data = []
    
    for i, item1 in enumerate(scraped_data):
        add_item = True
        for item2 in filtered_data:
            # Calculate similarity between the current item and any already added items
            similarity = SequenceMatcher(None, item1.get('text', '').lower(), item2.get('text', '').lower()).ratio()
            if similarity >= threshold:
                add_item = False
                break
        
        if add_item:
            filtered_data.append(item1)
    
    return filtered_data

# Apply redundancy filters to the scraped data
scraped_data = filter_redundant_data(scraped_data)
scraped_data = filter_similar_data(scraped_data, threshold=0.6)

# Function to find relevant responses from the scraped data
def get_response_from_data(prompt, scraped_data):
    prompt = prompt.strip().lower()
    threshold = 0.6

    matches = [
        {
            "title": item['metadata'].get('title', '').strip().lower(),
            "content": item.get('text', ''),
            "score": max(
                SequenceMatcher(None, prompt, item['metadata'].get('title', '').lower()).ratio(),
                SequenceMatcher(None, prompt, item['metadata'].get('category', '').lower()).ratio()
            ),
        }
        for item in scraped_data
        if SequenceMatcher(None, prompt, item['metadata'].get('title', '').lower()).ratio() >= threshold
           or SequenceMatcher(None, prompt, item['metadata'].get('category', '').lower()).ratio() >= threshold
    ]

    if matches:
        return max(matches, key=lambda x: x["score"])['content']
    return None

# Function to query Tavily API asynchronously
async def search_tavily(prompt):
    async with httpx.AsyncClient() as client:
        response = await client.post(
            "https://api.tavily.com/search",
            json={"query": prompt},
            headers={"Authorization": "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"}  # Replace with your actual API key
        )
        if response.status_code == 200:
            data = response.json()
            return data['results'][0].get('content', None) if 'results' in data and data['results'] else None
        else:
            return None

# Function to generate a response from the model with optimizations
def get_model_response(prompt, retrieved_data, feedback=None):
    start_time_model = time.time()  # Start timing the model inference

    # Combine the retrieved data and prompt
    combined_input = f"{retrieved_data} {prompt}"

    # Tokenize the combined input efficiently
    inputs = tokenizer(
        combined_input,
        return_tensors="pt",
        padding=True,
        truncation=True,
        max_length=min(512, len(combined_input.split()))
    ).to(device)

    # Adjust model parameters based on feedback
    temperature = 0.5  # Default temperature
    if feedback == "dislike":
        # Reduce temperature to make the response more deterministic
        temperature = 0.4
    elif feedback == "like":
        # Increase temperature slightly for more diversity
        temperature = 0.6

    with torch.no_grad():
        outputs = model.generate(
            **inputs,
            max_new_tokens=150,
            temperature=temperature,
            top_p=0.95,
            top_k=30,
            repetition_penalty=1.2,
            pad_token_id=tokenizer.eos_token_id
        )

    model_time = time.time() - start_time_model  # Calculate model inference time
    response = tokenizer.decode(outputs[0], skip_special_tokens=True)

    # Remove the prompt part from the response
    prompt_end_index = response.find(prompt)
    if prompt_end_index != -1:
        response = response[:prompt_end_index].strip()

    return response, model_time

# Main function to get the final response
async def get_final_response(prompt, feedback=None):
    start_time_total = time.time()  # Start timing the entire request process
    
    # Check for relevant data response
    data_response = get_response_from_data(prompt, scraped_data)
    
    if data_response:
        print(f"Scraped data match found in {time.time() - start_time_total:.2f} seconds")
        response, model_time = get_model_response(prompt, data_response, feedback)
        total_time = time.time() - start_time_total  # Calculate total time
        print(f"Model inference time: {model_time:.2f} seconds")
        print(f"Total time: {total_time:.2f} seconds")
        return {
            "response": response
        }
    
    # If no data found, proceed with API call
    tavily_response = await search_tavily(prompt)
    
    if tavily_response:
        print(f"Tavily API took {time.time() - start_time_total:.2f} seconds")
        response, model_time = get_model_response(prompt, tavily_response, feedback)
        total_time = time.time() - start_time_total  # Calculate total time
        print(f"Model inference time: {model_time:.2f} seconds")
        print(f"Total time: {total_time:.2f} seconds")
        return {
            "response": response
        }
    
    # Fallback if no relevant data found
    fallback_response = get_model_response(prompt, "No relevant external data found.", feedback)
    total_time = time.time() - start_time_total  # Calculate total time
    print(f"Fallback model response generated in {total_time:.2f} seconds")
    return {
        "response": fallback_response[0]
    }

# Function to match the prompt with metadata
def match_prompt_with_metadata(prompt, data):
    prompt_words = set(prompt.lower().split())
    best_match = None
    max_matches = 0
    for entry in data:
        title_words = set(entry['metadata']['category'].lower().split())
        matches = len(prompt_words & title_words)
        if matches > max_matches:
            max_matches = matches
            best_match = entry
    return best_match

def extract_key_value_pairs(text: str):
    keys = []
    values = []

    # Regex to match keys and values for labels like "Category: <key>" and "Count: <value>"
    pattern = r"(?:(?:Particular|Category|Stage|Year):\s*([\w\s\.\(\)-]+))\s*(?:Total|Count):\s*([0-9]+)"
    matches = re.findall(pattern, text)

    for key, value in matches:
        keys.append(key.strip())
        values.append(int(value.strip()))

    return keys, values

# Function to handle visualization requests
def visualize_data(prompt: str):
    # Match the prompt with the best metadata entry
    best_match = match_prompt_with_metadata(prompt, scraped_data)
    if not best_match:
        raise HTTPException(status_code=404, detail="No matching metadata found for visualization.")

    # Extract keys and values dynamically
    keys, values = extract_key_value_pairs(best_match['text'])
    if not keys or not values:
        raise HTTPException(status_code=400, detail="No valid data found in the text for visualization.")

    # Create a bar chart
    plt.figure(figsize=(10, 6))
    bars = plt.bar(keys, values, color='skyblue')
    plt.xlabel('Keys')
    plt.ylabel('Values')
    plt.title(f"Visualization for: {best_match['metadata']['category']}")
    plt.xticks(rotation=45, ha='right')
    plt.tight_layout()

    # Add numbers on top of each bar
    for bar in bars:
        height = bar.get_height()
        plt.text(
            bar.get_x() + bar.get_width() / 2.0,  # X-coordinate: center of the bar
            height,                               # Y-coordinate: top of the bar
            f"{height}",                          # Text: height value
            ha='center',                          # Horizontal alignment
            va='bottom',                          # Vertical alignment
            fontsize=10                           # Font size
        )

    # Save the chart to a BytesIO object (in-memory file)
    img_stream = BytesIO()
    plt.savefig(img_stream, format="png")
    plt.close()
    
    # Encode the image as base64
    img_stream.seek(0)
    img_base64 = base64.b64encode(img_stream.read()).decode('utf-8')

    return img_base64

@app.post("/query")
async def query(request: QueryRequest):
    prompt = request.prompt.strip().lower()

    try:
        if "visualize" in prompt:
            img_base64 = visualize_data(prompt)
            return JSONResponse(content={"image": img_base64})
        else:
            result = await get_final_response(prompt, request.feedback)
            return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error occurred: {str(e)}")
