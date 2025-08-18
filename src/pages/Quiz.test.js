
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Quiz from './Quiz';
import { questions } from '../data/questions';

describe('Quiz component', () => {
  test('renders the first question and progresses through the quiz', async () => {
    const handleFinish = jest.fn();
    render(<Quiz onFinish={handleFinish} />);

    // Check if the first question is rendered
    expect(screen.getByText(questions[0].question)).toBeInTheDocument();

    // Click the first answer of the first question
    const firstAnswerButton = screen.getByText(questions[0].answers[0].text);
    await userEvent.click(firstAnswerButton);

    // Check if the second question is rendered after a click
    // Note: We need to wait for the fade animation to complete
    expect(await screen.findByText(questions[1].question)).toBeInTheDocument();
  });

  test('calls onFinish with correct scores when all questions are answered', async () => {
    const handleFinish = jest.fn();
    render(<Quiz onFinish={handleFinish} />);

    // Simulate answering all questions
    for (let i = 0; i < questions.length; i++) {
      // Always choose the first answer for simplicity
      const answerButton = await screen.findByText(questions[i].answers[0].text);
      await userEvent.click(answerButton);
    }

    // Wait for onFinish to be called
    await waitFor(() => {
      expect(handleFinish).toHaveBeenCalledTimes(1);
    });

    // Check if the scores are correct
    // In this test, we always chose the first answer.
    // Let's calculate the expected score.
    const expectedScores = { Teto: 0, Egen: 0 };
    questions.forEach(q => {
        const answerType = q.answers[0].type;
        expectedScores[answerType]++;
    });

    expect(handleFinish).toHaveBeenCalledWith(expectedScores);
  });
});
