import React, { useState, useCallback } from 'react';

// Типы для данных GraphQL
interface UserBalanceStat { 
  user: string;          // Адрес кошелька пользователя (в формате строки)
  totalDeposited: string; // Общая сумма депозитов в wei (1 ETH = 10^18 wei)
  totalWithdrawn: string; // Общая сумма выводов в wei
  currentBalance: string; // Текущий баланс в wei
}

// Структура ответа от GraphQL сервера
interface QueryResponse {
  data: {
    userBalanceStats: UserBalanceStat[]; // Массив статистик по пользователям
  };
}

// Пример GraphQL-запроса для получения статистики балансов
const EXAMPLE_QUERY = `{
  userBalanceStats(orderBy: currentBalance, orderDirection: desc) {
    user
    totalDeposited
    totalWithdrawn
    currentBalance
  }
}`;

const GraphQLQuery: React.FC = () => {
  // Состояния компонента:
  const [queryResult, setQueryResult] = useState<QueryResponse | null>(null); // Результат запроса
  const [isLoading, setIsLoading] = useState<boolean>(false); // Флаг загрузки
  const [error, setError] = useState<string | null>(null); // Сообщение об ошибке

  // Функция выполнения запроса, обернутая в useCallback для оптимизации
  const executeQuery = useCallback(() => {
    setIsLoading(true); // Устанавливаем флаг загрузки
    setError(null); // Сбрасываем ошибку перед новым запросом

    // Имитация асинхронного запроса к API с помощью setTimeout
    setTimeout(() => {
      try {
        // Моковые данные, которые мы бы получали от реального API
        const mockResponse: QueryResponse = {
          data: {
            userBalanceStats: [
              {
                user: '0xabc123...', // Пример адреса кошелька
                totalDeposited: '1500000000000000000', // 1.5 ETH в wei
                totalWithdrawn: '500000000000000000',   // 0.5 ETH в wei
                currentBalance: '1000000000000000000', // 1 ETH в wei
              },
              {
                user: '0xdef456...', // Другой пример адреса
                totalDeposited: '500000000000000000',  // 0.5 ETH в wei
                totalWithdrawn: '0', // Нет выводов
                currentBalance: '500000000000000000',   // 0.5 ETH в wei
              },
            ],
          },
        };
        setQueryResult(mockResponse); // Сохраняем результат в состояние
      } catch (err) {
        // Обработка возможных ошибок
        setError('Ошибка при выполнении запроса');
      } finally {
        setIsLoading(false); // В любом случае снимаем флаг загрузки
      }
    }, 1000); // Имитация задержки сети в 1 секунду
  }, []); // Пустой массив зависимостей - функция создается один раз

  return (
    <div className="card">
      <h2>GraphQL Query</h2>
      
      {/* Секция с примером запроса */}
      <div className="query-section">
        <h3>Пример GraphQL запроса</h3>
        {/* pre для отображения форматированного кода запроса */}
        <pre>{EXAMPLE_QUERY}</pre>
        
        {/* Кнопка выполнения запроса */}
        <button 
          onClick={executeQuery} 
          disabled={isLoading}
        >
          {isLoading ? 'Выполнение...' : 'Выполнить запрос'}
        </button>
      </div>

      {/* Блок отображения ошибок, если они есть */}
      {error && <p className="error">{error}</p>}

      {/* Секция с результатами запроса */}
      {queryResult && (
        <div className="result-section">
          <h3>Результат запроса</h3>
          {/* pre для красивого отображения JSON */}
          <pre>
            {JSON.stringify(queryResult, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};

// Экспортируем компонент с memo для предотвращения лишних рендеров
export default React.memo(GraphQLQuery);