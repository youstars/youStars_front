import "./Table.css";

const users = [
  { id: 1, name: "Тестов Тестович", date: "01.02.2025", projects: 1, tasks: 1, rating: 1, avatar: "TT" },
  { id: 2, name: "Тестов Тестович", date: "01.02.2025", projects: 3, tasks: 3, rating: 3, avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=faces" },
  { id: 3, name: "Тестов Тестович", date: "01.02.2025", projects: 5, tasks: 5, rating: 5, avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=32&h=32&fit=crop&crop=faces" },
  { id: 4, name: "Тестов Тестович", date: "01.02.2025", projects: 0, tasks: 0, rating: 0, avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=32&h=32&fit=crop&crop=faces" },
  { id: 5, name: "Тестов Тестович", date: "01.02.2025", projects: 3, tasks: 3, rating: 3, avatar: "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=32&h=32&fit=crop&crop=faces" }
];

const UserTable = () => {
  return (
    <div className="user-list-container">
      <div className="user-list-header">
        <div></div>
        <div>ФИО</div>
        <div>Дата регистрации</div>
        <div>Проекты в процессе</div>
        <div>Задачи в процессе</div>
        <div>Общий рейтинг</div>
        <div></div>
      </div>

      <div className="user-list">
        {users.map((user) => (
          <div key={user.id} className="user-list-item">
            <div className="avatar-container">
              {user.avatar.startsWith('http') ? (
                <img src={user.avatar} alt="" className="user-avatar" />
              ) : (
                <div className="avatar-placeholder">{user.avatar}</div>
              )}
            </div>
            <div className="user-row">
              <div>{user.name}</div>
              <div>{user.date}</div>
              <div>{user.projects}</div>
              <div>{user.tasks}</div>
              <div>{user.rating}</div>
              <div>
                <button className="feedback-button">Написать специалисту</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserTable;