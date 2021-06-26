import { useHistory, useParams } from "react-router-dom";

import { useRoom } from "../hooks/useRoom";
import { database } from "../services/firebase";

import { Button } from "../components/Button";
import { RoomCode } from "../components/RoomCode";
import { Question } from "../components/Question";

import logoImg from "../assets/images/logo.svg";
import deleteImg from "../assets/images/delete.svg";
import checkImg from "../assets/images/check.svg";
import answerImg from "../assets/images/answer.svg";

import "../styles/room.scss";

type RoomParams = {
  id: string;
};

export function AdminRoom() {
  const history = useHistory();
  const { id: roomId } = useParams<RoomParams>();
  const { questions, title } = useRoom(roomId);

  async function handleEndRoom() {
    await database.ref(`rooms/${roomId}`).update({
      endedAt: new Date(),
    });

    history.push("/");
  }

  async function handleCheckQuestionAsAnswered(questionId: string) {
    await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
      isAnswered: true,
    });
  }

  async function handleHighlightQuestion(questionId: string) {
    await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
      isHighlighted: true,
    });
  }

  async function handleDeleteQuestion(questionId: string) {
    if (window.confirm("Tem certeza que você deseja excluir esta pergunta?")) {
      await database.ref(`rooms/${roomId}/questions/${questionId}`).remove();
    }
  }

  return (
    <div id="page-room">
      <header>
        <div className="content">
          <img src={logoImg} alt="Letmeask" />
          <div>
            <RoomCode code={roomId} />
            <Button isOutlined onClick={handleEndRoom}>
              Encerrar Sala
            </Button>
          </div>
        </div>
      </header>

      <main>
        <div className="content">
          <div className="room-title">
            <h1>Sala {title}</h1>
            {questions.length > 0 && (
              <span>
                {questions.length} pergunta{questions.length !== 1 && "s"}
              </span>
            )}
          </div>

          <div className="questions-list">
            {questions.map(
              ({ id, content, author, isAnswered, isHighlighted }) => {
                return (
                  <Question
                    key={id}
                    author={author}
                    content={content}
                    isAnswered={isAnswered}
                    isHighlighted={isHighlighted}
                  >
                    {!isAnswered && (
                      <>
                        <button
                          type="button"
                          onClick={() => handleCheckQuestionAsAnswered(id)}
                        >
                          <img
                            src={checkImg}
                            alt="marcar pergunta como respondida"
                          />
                        </button>

                        <button
                          type="button"
                          onClick={() => handleHighlightQuestion(id)}
                        >
                          <img src={answerImg} alt="Dar destaque à pergunta" />
                        </button>
                      </>
                    )}

                    <button
                      type="button"
                      onClick={() => handleDeleteQuestion(id)}
                    >
                      <img src={deleteImg} alt="Remover pergunta" />
                    </button>
                  </Question>
                );
              }
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
