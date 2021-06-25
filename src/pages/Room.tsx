import { FormEvent, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import logoImg from '../assets/images/logo.svg';
import { UserInfo } from '../components/UserInfo';
import { Button } from '../components/Button';
import { RoomCode } from '../components/RoomCode';
import { useAuth } from '../hooks/useAuth';

import { database } from '../services/firebase';

import '../styles/room.scss';

type RoomParams = {
	id: string;
}

type FirebaseQuestions = Record<string, {
	author: {
		name: string;
		avatar: string;
	},
	content: string;
	isAnswered: boolean;
	isHighlighted: boolean;
}>

type Question = {
	id: string;
	author: {
		name: string;
		avatar: string;
	},
	content: string;
	isAnswered: boolean;
	isHighlighted: boolean;
}

export function Room() {
	const { user } = useAuth();
	const { id: roomId } = useParams<RoomParams>();
	const [ newQuestion, setNewQuestion ] = useState('');
	const [ questions, setQuestions ] = useState<Question[]>([]);
	const [ title, setTitle ] = useState('');

	useEffect(() => {
		const roomRef = database.ref(`rooms/${roomId}`);

		roomRef.on('value', room => {
			const databaseRoom = room.val();
			const firebaseQuestions: FirebaseQuestions = databaseRoom.questions;
			const parsedQuestions = Object.entries(firebaseQuestions ?? {}).map(([ key, value ]) => {
				return {
					id: key,
					content: value.content,
					author: value.author,
					isHighlighted: value.isHighlighted,
					isAnswered: value.isAnswered,
				}
			})

			setTitle(databaseRoom.title);
			setQuestions(parsedQuestions);
		})

	}, [roomId]);

	async function handleSendQuestion(event: FormEvent) {
		event.preventDefault();

		if (newQuestion.trim() === '') {
			return;
		}

		if (!user) {
			throw new Error('You must be logged in');
		}

		const question = {
			content: newQuestion,
			author: {
				name: user.name,
				avatar: user.avatar,
			},
			isHighlighted: false,
			isAnswered: false,
		}

		await database.ref(`rooms/${roomId}/questions`).push(question);
	}

	return(
		<div id="page-room">
			<header>
				<div className="content">
					<img src={logoImg} alt="Letmeask" />
					<RoomCode 
						code={roomId}
					/>
				</div>
			</header>

			<main>
				<div className="content">
					<div className="room-title">
						<h1>Sala {title}</h1>
						{questions.length > 0 && <span>{questions.length} pergunta{questions.length !== 1 && 's'}</span>}
					</div>

					<form onSubmit={handleSendQuestion}>
						<textarea
							placeholder="O que você quer perguntar?"
							onChange={event => setNewQuestion(event.target.value)}
							value={newQuestion}
						/>

						<div className="form-footer">
							{
								user
								?
								<UserInfo
									name={user.name}
									avatar={user.avatar}
								/>
								:
								<span>Para enviar uma pergunta, <button>faça seu login.</button></span>
							}
							<Button type="submit" disabled={!user}>Faça uma pergunta</Button>
						</div>
					</form>
				</div>
			</main>
		</div>
	);
}