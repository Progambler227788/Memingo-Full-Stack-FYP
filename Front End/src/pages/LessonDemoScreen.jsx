import LessonComponent from "@/components/lessons/LessonComponent";
import { useParams, useNavigate } from 'react-router-dom';

export default function LessonDemoScreen() {
      const { courseId, lessonId } = useParams();
  return (
    <div>
        <LessonComponent courseId={courseId} lessonId={lessonId} />
    </div>
  );
}