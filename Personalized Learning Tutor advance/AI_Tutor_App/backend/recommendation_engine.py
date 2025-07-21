import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import linear_kernel

def create_dummy_data():
    """Create a dummy dataset of user interactions."""
    data = {
        'user_id': [1, 1, 1, 2, 2, 3, 3, 3, 3],
        'item_id': [1, 2, 3, 1, 4, 2, 3, 4, 5],
        'interaction_type': ['view', 'view', 'complete', 'view', 'view', 'view', 'complete', 'view', 'view'],
        'subject': ['python', 'python', 'python', 'python', 'java', 'python', 'python', 'java', 'c++'],
        'level': ['beginner', 'beginner', 'beginner', 'beginner', 'intermediate', 'beginner', 'beginner', 'intermediate', 'advanced']
    }
    return pd.DataFrame(data)

def train_recommendation_model(data):
    """Train a simple content-based filtering model."""
    # Create a TF-IDF vectorizer to convert text data into numerical features
    tfidf_vectorizer = TfidfVectorizer(stop_words='english')

    # Combine subject and level to create a single string for each item
    data['content'] = data['subject'] + ' ' + data['level']

    # Fit and transform the data
    tfidf_matrix = tfidf_vectorizer.fit_transform(data['content'])

    # Compute the cosine similarity between items
    cosine_sim = linear_kernel(tfidf_matrix, tfidf_matrix)

    return cosine_sim, data

def get_recommendations(user_id, cosine_sim, data):
    """Get recommendations for a given user."""
    # Get the items the user has interacted with
    user_items = data[data['user_id'] == user_id]['item_id'].unique()

    # Get the indices of the user's items
    item_indices = data[data['item_id'].isin(user_items)].index.unique()

    # Get the similarity scores for the user's items
    sim_scores = cosine_sim[item_indices].mean(axis=0)

    # Get the indices of the top N most similar items
    top_indices = sim_scores.argsort()[-5:][::-1]

    # Get the recommended item IDs
    recommended_item_ids = data.iloc[top_indices]['item_id'].unique()

    # Filter out items the user has already interacted with
    recommended_item_ids = [item_id for item_id in recommended_item_ids if item_id not in user_items]

    return data[data['item_id'].isin(recommended_item_ids)]
