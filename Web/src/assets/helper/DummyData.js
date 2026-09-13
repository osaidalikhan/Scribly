import {
  Apple,
  Brain,
  Dumbbell,
  HeartPulse,
  Moon,
  ShieldAlert,
} from "lucide-react";
import {
  fitness1,
  mentalhealth,
  nutrition,
  nutrition2,
  sleep1,
} from "./imagePath";

export const posts = [
  {
    id: 1,
    title: "Lorem ipsum dolor sit amet consectetur adipisicing elit",
    desc: "Lorem, ipsum dolor sit amet consectetur adipisicing elit. A possimus excepturi aliquid nihil cumque ipsam facere aperiam at! Ea dolorem ratione sit debitis deserunt repellendus numquam ab vel perspiciatis corporis!",
    img: "https://images.pexels.com/photos/7008010/pexels-photo-7008010.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
  },
  {
    id: 2,
    title: "Lorem ipsum dolor sit amet consectetur adipisicing elit",
    desc: "Lorem, ipsum dolor sit amet consectetur adipisicing elit. A possimus excepturi aliquid nihil cumque ipsam facere aperiam at! Ea dolorem ratione sit debitis deserunt repellendus numquam ab vel perspiciatis corporis!",
    img: "https://images.pexels.com/photos/6489663/pexels-photo-6489663.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
  },
  {
    id: 3,
    title: "Lorem ipsum dolor sit amet consectetur adipisicing elit",
    desc: "Lorem, ipsum dolor sit amet consectetur adipisicing elit. A possimus excepturi aliquid nihil cumque ipsam facere aperiam at! Ea dolorem ratione sit debitis deserunt repellendus numquam ab vel perspiciatis corporis!",
    img: "https://images.pexels.com/photos/4230630/pexels-photo-4230630.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
  },
  {
    id: 4,
    title: "Lorem ipsum dolor sit amet consectetur adipisicing elit",
    desc: "Lorem, ipsum dolor sit amet consectetur adipisicing elit. A possimus excepturi aliquid nihil cumque ipsam facere aperiam at! Ea dolorem ratione sit debitis deserunt repellendus numquam ab vel perspiciatis corporis!",
    img: "https://images.pexels.com/photos/6157049/pexels-photo-6157049.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
  },
];

export const categories = [
  {
    id: 1,
    title: "Mental Health",
    description:
      "Explore ways to manage stress, improve mental well-being, and cultivate a balanced mindset for a healthier life.",
    image: fitness1,
    icon: Brain,
  },
  {
    id: 2,
    title: "Fitness & Exercise",
    description:
      "Stay active with expert tips on workouts, strength training, and overall physical wellness for a healthier body.",
    image: sleep1,
    icon: Dumbbell,
  },
  {
    id: 3,
    title: "Cancer Awareness",
    description:
      "Learn about cancer prevention, early detection, and supportive care strategies to stay informed and empowered.",
    image: mentalhealth,
    icon: ShieldAlert,
  },
  {
    id: 4,
    title: "Sleep Health",
    description:
      "Understand the importance of quality sleep and discover tips to improve your sleep cycle for better overall health.",
    image: nutrition,
    icon: Moon,
  },
  {
    id: 5,
    title: "Nutrition & Diet",
    description:
      "Discover expert advice on healthy eating, balanced diets, and nutritional habits to fuel your body the right way.",
    image: nutrition2,
    icon: Apple,
  },
  {
    id: 6,
    title: "Heart Health",
    description:
      "Keep your heart strong with tips on cardiovascular health, cholesterol control, and daily heart-friendly habits.",
    icon: HeartPulse,
    image: fitness1,
  },
];
