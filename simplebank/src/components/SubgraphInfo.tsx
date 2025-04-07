import React from 'react';

// Компонент для отображения информации о реализации Subgraph
const SubgraphInfo: React.FC = () => {
  return (
    <div className="card">
      {/* Заголовок компонента */}
      <h2>Subgraph Implementation</h2>

      {/* Секция с определением GraphQL схемы */}
      <section className="subgraph-section">
        <h3>Schema Definition (schema.graphql)</h3>
        <pre>
          {`# Сущность для хранения каждого депозита
type DepositEntity @entity {
  id: ID!              # Уникальный идентификатор: txHash-logIndex
  depositor: Bytes!    # Адрес депозитора
  amount: BigInt!      # Сумма депозита в wei
  timestamp: BigInt!   # Временная метка блока
}

# Сущность для хранения каждого вывода
type WithdrawalEntity @entity {
  id: ID!              # Уникальный идентификатор: txHash-logIndex
  withdrawer: Bytes!   # Адрес получателя вывода
  amount: BigInt!      # Сумма вывода в wei
  timestamp: BigInt!   # Временная метка блока
}

# Сущность для агрегации статистики по пользователю
type UserBalanceStats @entity {
  id: ID!              # Адрес пользователя в hex
  user: Bytes!         # Адрес пользователя
  totalDeposited: BigInt! # Общая сумма депозитов в wei
  totalWithdrawn: BigInt! # Общая сумма выводов в wei
  currentBalance: BigInt! # Текущий баланс в wei
}`}
        </pre>
      </section>

      {/* Секция с обработчиками событий в AssemblyScript */}
      <section className="subgraph-section">
        <h3>Mapping Logic (mapping.ts)</h3>
        <pre>
          {`import { Deposit, Withdrawal } from "../generated/SimpleBank/SimpleBank"
import { DepositEntity, WithdrawalEntity, UserBalanceStats } from "../generated/schema"
import { BigInt } from "@graphprotocol/graph-ts"

// Функция обработки события депозита
export function handleDeposit(event: Deposit): void {
  // Создание новой записи о депозите
  let entity = new DepositEntity(
    event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  );
  entity.depositor = event.params.depositor;
  entity.amount = event.params.amount;
  entity.timestamp = event.block.timestamp;
  entity.save();

  // Обновление статистики пользователя
  let stats = UserBalanceStats.load(event.params.depositor.toHex());
  if (!stats) {
    // Инициализация статистики для нового пользователя
    stats = new UserBalanceStats(event.params.depositor.toHex());
    stats.user = event.params.depositor;
    stats.totalDeposited = BigInt.fromI32(0);
    stats.totalWithdrawn = BigInt.fromI32(0);
    stats.currentBalance = BigInt.fromI32(0);
  }
  // Обновление сумм депозитов и баланса
  stats.totalDeposited = stats.totalDeposited.plus(event.params.amount);
  stats.currentBalance = stats.currentBalance.plus(event.params.amount);
  stats.save();
}

// Функция обработки события вывода средств
export function handleWithdrawal(event: Withdrawal): void {
  // Создание новой записи о выводе
  let entity = new WithdrawalEntity(
    event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  );
  entity.withdrawer = event.params.withdrawer;
  entity.amount = event.params.amount;
  entity.timestamp = event.block.timestamp;
  entity.save();

  // Обновление статистики пользователя
  let stats = UserBalanceStats.load(event.params.withdrawer.toHex());
  if (!stats) {
    // Инициализация статистики для нового пользователя
    stats = new UserBalanceStats(event.params.withdrawer.toHex());
    stats.user = event.params.withdrawer;
    stats.totalDeposited = BigInt.fromI32(0);
    stats.totalWithdrawn = BigInt.fromI32(0);
    stats.currentBalance = BigInt.fromI32(0);
  }
  // Обновление сумм выводов и баланса
  stats.totalWithdrawn = stats.totalWithdrawn.plus(event.params.amount);
  stats.currentBalance = stats.currentBalance.minus(event.params.amount);
  stats.save();
}`}
        </pre>
      </section>

      {/* Секция с конфигурацией subgraph.yaml */}
      <section className="subgraph-section">
        <h3>Subgraph Manifest (subgraph.yaml)</h3>
        <pre>
          {`# Версия спецификации subgraph
specVersion: 0.0.5
# Путь к файлу схемы
schema:
  file: ./schema.graphql
# Настройки источников данных
dataSources:
  - kind: ethereum/contract
    name: SimpleBank
    network: goerli
    source:
      address: "0x..." # Замените на реальный адрес контракта
      abi: SimpleBank
      startBlock: 1234567 # Укажите блок развертывания
    mapping:
      kind: ethereum/events
      apiVersion: 0.0.7
      language: wasm/assemblyscript
      entities:
        - DepositEntity
        - WithdrawalEntity
        - UserBalanceStats
      abis:
        - name: SimpleBank
          file: ./abis/SimpleBank.json
      eventHandlers:
        - event: Deposit(indexed address,uint256)
          handler: handleDeposit
        - event: Withdrawal(indexed address,uint256)
          handler: handleWithdrawal
      file: ./src/mapping.ts`}
        </pre>
      </section>

      {/* Секция с инструкциями по развертыванию */}
      <section className="subgraph-section">
        <h3>Инструкции по развертыванию</h3>
        <pre>
          {`# Шаги для развертывания subgraph:
1. Установите зависимости:
   npm install -g @graphprotocol/graph-cli
2. Сгенерируйте код из ABI и схемы:
   graph codegen
3. Разверните субграф (локально или на hosted service):
   graph deploy --node http://localhost:8020/ --ipfs http://localhost:5001
   # Для hosted service:
   graph deploy --product hosted-service your-username/simple-bank-subgraph`}
        </pre>
      </section>
    </div>
  );
};

// Экспорт компонента с мемоизацией для оптимизации производительности
export default React.memo(SubgraphInfo);