import torch
import torch.nn.functional as F
from transformers import AutoTokenizer, AutoModelForSequenceClassification
import re
import string

def clean_text(text: str) -> str:
    """
    Cleaning the input text.
    """
    text = text.lower()
    text = re.sub(r"http\S+|www\S+|https\S+", "", text, flags=re.MULTILINE)
    text = text.translate(str.maketrans("", "", string.punctuation))
    return text

class ToxicityModel:
    def __init__(self, model_path: str, threshold: float = 0.63):
        """
        Loading the model and tokenizer.
        """
        self.threshold = threshold
        self.tokenizer = AutoTokenizer.from_pretrained(model_path)
        self.model = AutoModelForSequenceClassification.from_pretrained(model_path)
        self.model.eval()

    def assess(self, message: str) -> str:
        """
        Determines whether the input message is toxic.
        Returns "Toxic" if the probability of toxicity meets or exceeds the threshold,
        otherwise returns "Not Toxic".
        """
        cleaned = clean_text(message)
        inputs = self.tokenizer(cleaned, return_tensors="pt", truncation=True, max_length=128)
        with torch.no_grad():
            outputs = self.model(**inputs)
        probs = F.softmax(outputs.logits, dim=1)
        prob_toxic = probs[0, 1].item()
        return "Toxic" if prob_toxic >= self.threshold else "Not Toxic"

def load_model():
    """
    Load the toxicity model.
    """
    model_path = ".\\toxicity_final_model"
    return ToxicityModel(model_path)
