import { QuizProfile } from "../store/quizStore";


type FilterQuizTypes = {
    quizzesFetch: QuizProfile[]
    searchTerm: string
    selectedCategory: string;
    selectedSubject: string;

}

const FilterQuiz = ({quizzesFetch, searchTerm, selectedCategory, selectedSubject} : FilterQuizTypes) => {
    
    const publishedQuizzes = quizzesFetch.filter((allQuiz) => allQuiz.isPublished)
    const filteredQuizzes = publishedQuizzes.filter((quiz) => {
        
        const matchesSearches = 
            quiz.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            quiz.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
            quiz.category.toLowerCase().includes(searchTerm.toLowerCase());
    
        const matchesCategory = 
            selectedCategory === 'all' ||
            quiz.category.toLowerCase() === selectedCategory.toLowerCase()

        const matchesSubject =
            selectedSubject === 'all' ||
            quiz.subject.toLowerCase() === selectedSubject.toLowerCase();
        

        return matchesSearches && matchesCategory && matchesSubject;
    
        })
    
    
    return filteredQuizzes;
        

}

export default FilterQuiz;