function validateAnswers(answers) {
	if (answers.length != 4) {
		return "There must be 4 answers";
	}
}

function validateQuestion(question) {
	if (question.length < 10 || question.length > 200) {
		return "Question must be between 10 and 200 characters";
	}
}

export function validateInputs(answers, question) {
	const answer_invalid = validateAnswers(answers);
	const question_invalid = validateQuestion(question);
	return answer_invalid ? answer_invalid : question_invalid;
}
