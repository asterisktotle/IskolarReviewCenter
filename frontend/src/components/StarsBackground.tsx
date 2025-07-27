import { useEffect, useState } from "react"

interface StarsType {
    id: number,
    size: number,
    xCoordinate: number,
    yCoordinate: number,
    animationDuration: number
    opacity?: number,
    delay?:number,
}



const StarsBackground = () => {
    const [stars, setStars] = useState<StarsType[]>([])
    const [meteors, setMeteors] = useState<StarsType[]>([])


    useEffect(() => {
        generateStars()
        generateMeteors()

        const handleResize = () => {
            generateStars();
        }

        window.addEventListener('resize', handleResize)

        return () => window.removeEventListener("resize", handleResize)
    },[])

    const generateStars = () => {
        const numberOfStars = Math.floor(
            (window.innerWidth * window.innerHeight) / 1000
        );

        const newStars : StarsType[] = []

        for (let i = 0 ; i < numberOfStars; i++){
            newStars.push({
                id: i,
                size: Math.random() * 3 ,
                yCoordinate: Math.random() * 100,
                xCoordinate: Math.random() * 100,
                opacity: Math.random() * 0.5 + 0.2,
                animationDuration: Math.random() * 4 + 2,
            })
        }

        setStars(newStars);
    }

    const generateMeteors = () => {
        const numberOfMeteors = 50

        const newMeteors : StarsType[] = []

        for (let i = 0 ; i < numberOfMeteors; i++){
            newMeteors.push({
                id: i,
                size: Math.random() * 5 ,
                yCoordinate: Math.random() * 100,
                xCoordinate: Math.random() * 100,
                delay: Math.random() * 0.5 + 10,
                animationDuration: Math.random() * 4 * 5, 
                opacity: Math.random() * 0.5 + 0.5, 
            })
        }

        setMeteors(newMeteors);
    }



    return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        {stars.map((star) => (
            <div key={star.id} 
            className="star animate-pulse-subtle"
            style={{
                width: `${star.size}px`,
                height: `${star.size}px`,
                left: `${star.xCoordinate}%`,
                top: `${star.yCoordinate}%`,
                opacity: `${star.opacity}%`,
                animationDuration: `${star.animationDuration}s`

            }}
            />
        ))}

         {meteors.map((meteor) => (
            <div key={meteor.id} 
            className="meteor animate-meteor"
            style={{
                width: `${meteor.size * 20}px`,
                height: `${meteor.size * 0.5}px`,
                left: `${meteor.xCoordinate}%`,
                top: `${meteor.yCoordinate}%`,
                animationDelay: `${meteor.delay}%`,
                animationDuration: `${meteor.animationDuration}s`,
                opacity: `${meteor.opacity}%`
            }}
            />
        ))}

    </div>
  )
}

export default StarsBackground