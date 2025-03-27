from fastapi import FastAPI
from pydantic import BaseModel
from model import load_model # Import the Toxicity analysis model
from fastapi.middleware.cors import CORSMiddleware

# Create fastapi instance for HTTP processing
app = FastAPI()

origins = [
    "http://localhost:5173",
    "http://localhost:3000"
]

# Allow for listed orgins to make API requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
model = load_model() # Load the model so we can interact with it

class MessageInput(BaseModel): # Pydantic model to define the HTTP query
    message: str

# Handle message moderation upon "/predict" fetch
@app.post("/predict")
async def predict(input_message: MessageInput):
    prediction = process_message(input_message.message)

    return{"response": prediction}

# Message handler, calls assess function of model
def process_message(message: str) -> str:
    response = model.assess(message)

    return response
