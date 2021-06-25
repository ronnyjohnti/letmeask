import '../styles/user-info.scss';

type UserInfoProps = {
	name: string;
	avatar: string;
}

export function UserInfo(props: UserInfoProps) {
	return(
		<div className="user-info">
			<img src={props.avatar} alt={props.name} />
			<span>{props.name}</span>
		</div>
	);
}