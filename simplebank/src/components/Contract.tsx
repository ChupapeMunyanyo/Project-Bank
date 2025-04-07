import React, { useState, useCallback } from 'react';

// Интерфейс для описания транзакции
interface Transaction {
  id: string;          // Уникальный ID (timestamp + случайная строка)
  type: 'deposit' | 'withdrawal';  // Тип операции
  address: string;     // Адрес кошелька пользователя
  amount: string;      // Сумма в ETH (строка для точности)
  timestamp: Date;     // Дата и время транзакции
}

// Фиксированный адрес пользователя для демонстрации
const USER_ADDRESS = '0x742d35Cc6634C0532925a3b844Bc454e4438f44e';

const ContractInteraction: React.FC = () => {
  // Состояния компонента
  const [depositAmount, setDepositAmount] = useState<string>(''); // Сумма для депозита
  const [withdrawAmount, setWithdrawAmount] = useState<string>(''); // Сумма для вывода
  const [transactions, setTransactions] = useState<Transaction[]>([]); // Список транзакций
  const [error, setError] = useState<string | null>(null); // Сообщение об ошибке

  // Обработчик ввода суммы (универсальный для депозита/вывода)
  const handleAmountChange = useCallback(
    (setter: React.Dispatch<React.SetStateAction<string>>) => 
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      // Регулярное выражение: допускает числа с точкой (например, "1.5")
      if (value === '' || (/^\d*\.?\d*$/.test(value) && Number(value) >= 0)) {
        setter(value);  // Обновляем состояние
        setError(null); // Сбрасываем ошибку
      } else {
        setError('Введите корректное положительное число');
      }
    },
    [], // Зависимости отсутствуют
  );

  // Добавление транзакции в историю
  const addTransaction = useCallback(
    (type: 'deposit' | 'withdrawal', amount: string) => {
      // Валидация: сумма должна быть > 0
      if (!amount || Number(amount) <= 0) {
        setError('Сумма должна быть больше 0');
        return;
      }

      // Создаем новую транзакцию
      const newTransaction: Transaction = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2)}`, // Генерация ID
        type,
        address: USER_ADDRESS,
        amount,
        timestamp: new Date(), // Текущее время
      };

      // Добавляем в начало массива (новые сверху)
      setTransactions((prev) => [newTransaction, ...prev]);
      setError(null); // Сбрасываем ошибку
    },
    [], // Зависимости отсутствуют
  );

  // Обработчики кнопок
  const handleDeposit = useCallback(() => {
    addTransaction('deposit', depositAmount);
    setDepositAmount(''); // Очищаем поле ввода
  }, [depositAmount, addTransaction]);

  const handleWithdraw = useCallback(() => {
    addTransaction('withdrawal', withdrawAmount);
    setWithdrawAmount(''); // Очищаем поле ввода
  }, [withdrawAmount, addTransaction]);

  return (
    <div className="card">
      <h2>SimpleBank Contract</h2>
      
      {/* Отображение кода контракта Solidity */}
      <div className="contract-code">
        <pre>
          {`// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract SimpleBank {
    mapping(address => uint256) public balances;

    event Deposit(address indexed depositor, uint256 amount);
    event Withdrawal(address indexed withdrawer, uint256 amount);

    function deposit() public payable {
        require(msg.value > 0, "Deposit must be > 0");
        balances[msg.sender] += msg.value;
        emit Deposit(msg.sender, msg.value);
    }

    function withdraw(uint256 amount) public {
        require(balances[msg.sender] >= amount, "Insufficient balance");
        balances[msg.sender] -= amount;
        payable(msg.sender).transfer(amount);
        emit Withdrawal(msg.sender, amount);
    }
}`}
        </pre>
      </div>

      {/* Интерфейс взаимодействия */}
      <div className="interaction-section">
        <h3>Взаимодействие с контрактом</h3>
        {error && <p className="error">{error}</p>} {/* Блок ошибок */}

        {/* Поле депозита */}
        <div className="input-group">
          <input
            type="text"
            value={depositAmount}
            onChange={handleAmountChange(setDepositAmount)} // Передаем setter
            placeholder="Сумма депозита (ETH)"
            aria-label="Сумма депозита"
          />
          <button onClick={handleDeposit} disabled={!depositAmount}>
            Депозит
          </button>
        </div>

        {/* Поле вывода */}
        <div className="input-group">
          <input
            type="text"
            value={withdrawAmount}
            onChange={handleAmountChange(setWithdrawAmount)} // Передаем setter
            placeholder="Сумма вывода (ETH)"
            aria-label="Сумма вывода"
          />
          <button onClick={handleWithdraw} disabled={!withdrawAmount}>
            Вывод
          </button>
        </div>

        {/* История транзакций */}
        {transactions.length > 0 && (
          <div className="transactions-log">
            <h4>История транзакций</h4>
            <div className="transactions-list">
              {transactions.map((tx) => (
                <div key={tx.id} className={`transaction ${tx.type}`}>
                  <div className="transaction-type">
                    {tx.type === 'deposit' ? 'Депозит' : 'Вывод'}
                  </div>
                  <div className="transaction-details">
                    <span className="address">{tx.address}</span>
                    <span className="amount">{tx.amount} ETH</span>
                    <span className="timestamp">
                      {tx.timestamp.toLocaleString()} {/* Форматированная дата */}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default React.memo(ContractInteraction); // Оптимизация ререндеров