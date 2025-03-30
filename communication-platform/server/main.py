
from fastapi import FastAPI
from pydantic import BaseModel
from model_inference import load_model
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

origins = [
    "http://localhost:5173",
    "http://localhost:3000"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load the model
model = load_model()

class MessageInput(BaseModel):
    message: str

@app.post("/predict")
async def predict(input_message: MessageInput):
    prediction = process_message(input_message.message)
    return {"response": prediction}

def process_message(message: str) -> str:
    response = model.assess(message)
    return response
