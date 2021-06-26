import { ReactNode } from "react";
import { UserInfo } from "../components/UserInfo";

import '../styles/question.scss';

type QuestionProps = {
  author: {
    name: string;
    avatar: string;
  };
  content: string;
	children: ReactNode;
  // isAnswered: boolean;
  // isHighlighted: boolean;
};

export function Question({
	content,
	author, children
}: QuestionProps) {
	return(
		<div className="question">
			<p>{content}</p>
			<footer>
				<UserInfo
					name={author.name}
					avatar={author.avatar}
				/>
				<div>
					{children}
				</div>
			</footer>
		</div>
	);
}