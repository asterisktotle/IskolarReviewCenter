import { CategoryTypes, SubjectTypes } from "../interfaces/QuizzesTypes";
import { QuizProfile } from "../store/quizStore";


interface FilterTypes {
    quizzesFetch: QuizProfile[],
    filters:{
        searchTerm: string,
        selectedCategory: CategoryTypes ,
        selectedSubject: SubjectTypes,
    }
}

const FilterQuiz = ({quizzesFetch, filters} : FilterTypes) => {
    
    const publishedQuizzes = quizzesFetch.filter((allQuiz) => allQuiz.isPublished)
    const filteredQuizzes = publishedQuizzes.filter((quiz) => {
        
        const matchesSearches = 
            quiz.title.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
            quiz.subject.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
            quiz.category.toLowerCase().includes(filters.searchTerm.toLowerCase());
    
        const matchesCategory = 
            filters.selectedCategory === 'all' ||
            quiz.category.toLowerCase() === filters.selectedCategory.toLowerCase()

        const matchesSubject =
            filters.selectedSubject === 'all' ||
            quiz.subject.toLowerCase() === filters.selectedSubject.toLowerCase();
        

        return matchesSearches && matchesCategory && matchesSubject;
    
        })
    
    
    return filteredQuizzes;
        

}

export default FilterQuiz;