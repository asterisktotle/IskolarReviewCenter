import pdfplumber
import re
from typing import List, Dict, Tuple


pdf_file_path: str = "pdf_extractor/BEF_PIPE.pdf"

def extract_pdf_text(pdf_file_path):
    """
    Extract text from PDF file, handling left and right columns separately
    """
    full_text = ""
    
    try:
        with pdfplumber.open(pdf_file_path) as pdf:
            for page_num, page in enumerate(pdf.pages):
                print(f"Processing page {page_num + 1}...")
                
                # Get page dimensions
                page_width = page.width
                mid_point = page_width / 2
                
                # Extract left column
                left_column = page.crop((0, 0, mid_point, page.height))
                left_text = left_column.extract_text()
                
                # Extract right column
                right_column = page.crop((mid_point, 0, page_width, page.height))
                right_text = right_column.extract_text()
                
                # Combine text with clear separation
                if left_text:
                    full_text += left_text + "\n"
                if right_text:
                    full_text += right_text + "\n"
                    
    except Exception as e:
        print(f"Error reading PDF: {e}")
        return None
    
    return full_text

# Extract Questions and Answers
def extract_questions(text):
    """
    Extract questions, choices, and answers from text
    """
    questions_list = []
    
    # Split text by question numbers (1., 2., 3., etc.)
    question_blocks = re.split(r'\n(?=\d+\.)', text)
    
    for block in question_blocks:
        if not block.strip():
            continue
            
        # Look for question pattern: number followed by question text
        question_match = re.search(r'^(\d+)\.\s*(.+?)(?=\n[a-dA-D]\.)', block, re.MULTILINE | re.DOTALL)
        
        if question_match:
            question_num = question_match.group(1)
            question_text = question_match.group(2).strip()
            
            # Find all choices (A., B., C., D.)
            choices = {}
            choice_pattern = r'([a-dA-D])\.\s*(.+?)(?=\n[a-dA-D]\.|ANSWER|$)'
            choice_matches = re.findall(choice_pattern, block, re.MULTILINE | re.DOTALL)
            
            for letter, choice_text in choice_matches:
                choices[letter] = choice_text.strip()
            
            # Find the correct answer
            answer_match = re.search(r'ANSWER:\s*([a-dA-D])', block)
            correct_answer = answer_match.group(1) if answer_match else "Not found"
            
            # Store the question data
            question_data = {
                'number': question_num,
                'question': question_text,
                'choices': choices,
                'answer': correct_answer
            }
            
            questions_list.append(question_data)
    
    return questions_list

# STEP 4: Format and Display Questions
def display_question(question_data):
    """
    Display question in clean format
    """
    print(f"Question {question_data['number']}:")
    print(question_data['question'])
    
    # Display choices
    for letter in ['A', 'B', 'C', 'D']:
        if letter in question_data['choices']:
            print(f"{letter}. {question_data['choices'][letter]}")
    
    print(f"Answer: {question_data['answer']}")
    print("-" * 50)

# STEP 5: Save to File CHANGE FILE NAME
def save_questions_to_file(questions_list, output_file=None):
    """
    Save extracted questions to a text file
    """
    if output_file is None:
        output_file = pdf_file_path.replace(".pdf", "_questions.txt")
    
    with open(output_file, 'w', encoding='utf-8') as f:
        for q in questions_list:
            f.write(f"Question {q['number']}:\n")
            f.write(f"{q['question']}\n")
            
            for letter in ['A', 'B', 'C', 'D']:
                if letter in q['choices']:
                    f.write(f"{letter}. {q['choices'][letter]}\n")
            
            f.write(f"Answer: {q['answer']}\n")
            f.write("-" * 50 + "\n\n")
    
    print(f"Questions saved to {output_file}")


# MAIN FUNCTION - Put it all together
def main():
    """
    Main function - Run this to extract questions from your PDF
    """
    
    # CHANGE THIS PATH TO YOUR PDF FILE
    # pdf_file_path = "MESL_ELEMENTS_9.pdf"  # Replace with your PDF file path
    
    print("Starting PDF question extraction...")
    
    # Step 1: Extract text from PDF
    print("Step 1: Extracting text from PDF...")
    pdf_text = extract_pdf_text(pdf_file_path)
    
    if not pdf_text:
        print("Failed to extract text from PDF")
        return
    
    print(f"Extracted {len(pdf_text)} characters from PDF")
    
    # Step 2: Extract questions from text
    print("Step 2: Parsing questions...")
    questions = extract_questions(pdf_text)
    
    print(f"Found {len(questions)} questions")
    
    # Step 3: Display first few questions
    print("Step 3: Displaying first 3 questions...")
    for i, question in enumerate(questions[:3]):
        display_question(question)
    
    # Step 4: Save all questions to file
    print("Step 4: Saving all questions to file...")
    save_questions_to_file(questions)
    
    return questions



main()