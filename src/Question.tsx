import ReactMarkdown from 'react-markdown';

import './styles/QuestionView.css';

/**
 * QuestionViewProps
 * Simply holds the question by may hold additional data
 * in the future
 */
export type QuestionViewProps = {
  question: string
}


/**
 * QuestionView, used to generate a view for the
 * user so they can try and answer the question
 */
export function QuestionView(props: QuestionViewProps) {

  const question = props.question;
  const questionHTML = (<ReactMarkdown>{question}</ReactMarkdown>);

  return (<div className="sqlQuestionView">
    {questionHTML}
  </div>)
}
