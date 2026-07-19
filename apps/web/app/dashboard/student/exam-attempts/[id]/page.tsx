'use client';

import React from 'react';

import { useMutation, useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { examAttemptService, type AttemptQuestion } from '@/lib/services/exam-attempt.service';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { LoaderCircle, CheckCircle2, AlertTriangle, Clock } from 'lucide-react';

export default function ExamAttemptPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id: attemptId } = React.use(params);

  const { data, isLoading } = useQuery({
    queryKey: ['attempt', attemptId],
    queryFn: () => examAttemptService.getAttempt(attemptId),
    refetchOnWindowFocus: false,
  });

  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string[]>>({});
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');

  const attempt = data?.attempt;
  const questions = data?.questions || [];
  const currentQuestion = questions[currentQuestionIdx];

  // Initialize from existing attempt answers if any
  useEffect(() => {
    if (attempt?.answers) {
      const initialAnswers: Record<string, string[]> = {};
      attempt.answers.forEach((ans) => {
        if (ans.selectedOptionIds) {
          initialAnswers[ans.questionId] = ans.selectedOptionIds;
        }
      });
      setAnswers(initialAnswers);
    }
  }, [attempt?.answers]);

  // Timer logic
  useEffect(() => {
    if (attempt?.remainingTime) {
      setTimeLeft(attempt.remainingTime);
    }
  }, [attempt?.remainingTime]);

  useEffect(() => {
    if (timeLeft === null || timeLeft <= 0) return;
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev !== null && prev <= 1) {
          clearInterval(interval);
          submitMutation.mutate();
          return 0;
        }
        return prev !== null ? prev - 1 : prev;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [timeLeft]);

  const saveMutation = useMutation({
    mutationFn: (args: { questionId: string; selectedOptionIds: string[] }) =>
      examAttemptService.saveAnswer(attemptId, args),
    onMutate: () => setSaveStatus('saving'),
    onSuccess: () => setSaveStatus('saved'),
    onError: () => setSaveStatus('error'),
  });

  const submitMutation = useMutation({
    mutationFn: () => examAttemptService.submitAttempt(attemptId),
    onSuccess: () => {
      router.replace(`/dashboard/student/exam-results/${attemptId}`);
    },
  });

  const handleSelectOption = (
    questionId: string,
    optionId: string,
    type: AttemptQuestion['type'],
  ) => {
    setAnswers((prev) => {
      const newAnswers = { ...prev };
      if (type === 'MULTIPLE_CHOICE' || type === 'TRUE_FALSE') {
        newAnswers[questionId] = [optionId];
      } else if (type === 'MULTIPLE_SELECT') {
        const current = newAnswers[questionId] || [];
        if (current.includes(optionId)) {
          newAnswers[questionId] = current.filter((id) => id !== optionId);
        } else {
          newAnswers[questionId] = [...current, optionId];
        }
      }

      // trigger save
      saveMutation.mutate({ questionId, selectedOptionIds: newAnswers[questionId] || [] });
      return newAnswers;
    });
  };

  const handleSubmit = () => {
    if (confirm('Bạn có chắc chắn muốn nộp bài? Hành động này không thể hoàn tác.')) {
      submitMutation.mutate();
    }
  };

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    if (h > 0) return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  if (isLoading) return <div className="p-8 text-center">Đang tải bài thi...</div>;
  if (!attempt || !currentQuestion) return <div className="p-8 text-center">Lỗi tải bài thi.</div>;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 min-h-[calc(100vh-100px)]">
      {/* Sidebar Navigation */}
      <div className="lg:col-span-1 space-y-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-4 text-xl font-bold justify-center text-blue-600">
              <Clock className="h-5 w-5" />
              {timeLeft !== null ? formatTime(timeLeft) : '--:--'}
            </div>

            <div className="flex items-center justify-between text-sm mb-4">
              <span>
                Đã làm: {Object.keys(answers).length}/{questions.length}
              </span>
              <span className="flex items-center gap-1">
                {saveStatus === 'saving' && (
                  <>
                    <LoaderCircle className="h-3 w-3 animate-spin" /> Đang lưu
                  </>
                )}
                {saveStatus === 'saved' && (
                  <>
                    <CheckCircle2 className="h-3 w-3 text-green-500" /> Đã lưu
                  </>
                )}
                {saveStatus === 'error' && (
                  <>
                    <AlertTriangle className="h-3 w-3 text-red-500" /> Lỗi lưu
                  </>
                )}
              </span>
            </div>

            <div className="grid grid-cols-5 gap-2">
              {questions.map((q, idx) => {
                const isAnswered = (answers[q.questionId]?.length ?? 0) > 0;
                const isCurrent = idx === currentQuestionIdx;
                return (
                  <button
                    key={q.id}
                    onClick={() => setCurrentQuestionIdx(idx)}
                    className={`h-10 w-full rounded-md border text-sm font-medium transition-colors
                      ${isCurrent ? 'ring-2 ring-blue-600 ring-offset-2' : ''}
                      ${isAnswered ? 'bg-blue-600 text-white border-blue-600' : 'bg-white hover:bg-slate-100 text-slate-700'}
                    `}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>

            <div className="mt-8">
              <Button
                className="w-full font-bold"
                variant="default"
                onClick={handleSubmit}
                disabled={submitMutation.isPending}
              >
                {submitMutation.isPending ? 'Đang nộp...' : 'Nộp bài'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Question Area */}
      <div className="lg:col-span-3 space-y-6">
        <Card className="h-full flex flex-col">
          <CardContent className="p-8 flex-1">
            <div className="mb-6 flex justify-between items-center border-b pb-4">
              <h2 className="text-xl font-bold">Câu hỏi {currentQuestionIdx + 1}</h2>
              <span className="text-sm font-medium bg-slate-100 px-3 py-1 rounded-full text-slate-600">
                {currentQuestion.points} điểm
              </span>
            </div>

            <div className="prose max-w-none mb-8 text-lg">{currentQuestion.content}</div>

            <div className="space-y-4">
              {currentQuestion.type === 'MULTIPLE_CHOICE' ||
              currentQuestion.type === 'TRUE_FALSE' ? (
                <RadioGroup
                  value={answers[currentQuestion.questionId]?.[0] || ''}
                  onValueChange={(val: string) =>
                    handleSelectOption(currentQuestion.questionId, val, currentQuestion.type)
                  }
                >
                  {currentQuestion.options.map((opt) => (
                    <div
                      key={opt.id}
                      className="flex items-center space-x-3 rounded-lg border p-4 hover:bg-slate-50 cursor-pointer transition-colors"
                      onClick={() =>
                        handleSelectOption(currentQuestion.questionId, opt.id, currentQuestion.type)
                      }
                    >
                      <RadioGroupItem value={opt.id} id={opt.id} />
                      <Label
                        htmlFor={opt.id}
                        className="flex-1 cursor-pointer text-base font-normal"
                      >
                        {opt.content}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              ) : currentQuestion.type === 'MULTIPLE_SELECT' ? (
                <div className="space-y-3">
                  {currentQuestion.options.map((opt) => {
                    const isChecked = (answers[currentQuestion.questionId] || []).includes(opt.id);
                    return (
                      <div
                        key={opt.id}
                        className="flex items-center space-x-3 rounded-lg border p-4 hover:bg-slate-50 cursor-pointer transition-colors"
                        onClick={() =>
                          handleSelectOption(
                            currentQuestion.questionId,
                            opt.id,
                            currentQuestion.type,
                          )
                        }
                      >
                        <Checkbox
                          id={opt.id}
                          checked={isChecked}
                          onCheckedChange={() =>
                            handleSelectOption(
                              currentQuestion.questionId,
                              opt.id,
                              currentQuestion.type,
                            )
                          }
                        />
                        <Label
                          htmlFor={opt.id}
                          className="flex-1 cursor-pointer text-base font-normal"
                        >
                          {opt.content}
                        </Label>
                      </div>
                    );
                  })}
                </div>
              ) : null}
            </div>
          </CardContent>
          <div className="border-t p-6 flex justify-between bg-slate-50 rounded-b-xl">
            <Button
              variant="outline"
              onClick={() => setCurrentQuestionIdx((prev) => Math.max(0, prev - 1))}
              disabled={currentQuestionIdx === 0}
            >
              Câu trước
            </Button>
            <Button
              onClick={() =>
                setCurrentQuestionIdx((prev) => Math.min(questions.length - 1, prev + 1))
              }
              disabled={currentQuestionIdx === questions.length - 1}
            >
              Câu tiếp
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
