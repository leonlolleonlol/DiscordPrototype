# Store the function in a dictionary
class Model:

    # Define the predict function
    def assess(self, message: str):
        if message == "hello":
            return "not toxic"
        else:
            return "toxic"


def load_model():
    return Model()