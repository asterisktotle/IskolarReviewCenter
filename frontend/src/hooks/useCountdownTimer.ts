import { useEffect, useRef, useState } from "react"

const pad = (n: number) => n.toString().padStart(2, "0");
const useCountdownTimer = (timeLimit: number) => {
  const [timeLeft, setTimeLeft] = useState(timeLimit * 60) //seconds
  const [isTimeUp, setIsTimeUp] = useState(false)
  const intervalRef = useRef<number | null>(null)

  useEffect(() => {
    // Check if time limit is 0l then clear the timer
    if(!timeLimit || timeLimit < 0){
      setTimeLeft(0)
      setIsTimeUp(false);
      return;
    }
    setTimeLeft(timeLimit * 60);
    setIsTimeUp(false);

    intervalRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if(prev <= 1){
          clearInterval(intervalRef.current!);
          setIsTimeUp(true)
          return 0;
        }
        return prev - 1;
      });
      }, 1000)

    return () => {
      if(intervalRef.current) clearInterval(intervalRef.current);
    };

  }, [timeLimit])
  
  const clearTimer = () => {
    if(intervalRef.current) clearInterval(intervalRef.current);
  }

  const hours = Math.floor(timeLeft / 3600);
  const minutes = Math.floor((timeLeft % 3600) / 60);
  const seconds = timeLeft % 60;

  const formatted = `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;

  return { formatted, isTimeUp, timeLeft , clearTimer};

}

export default useCountdownTimer;