export const WalletRow = ({ amount, usdValue, formattedAmount }: { amount: number, usdValue: number, formattedAmount: string }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'row', gap: 16, backgroundColor: 'lightgray', padding: 16, marginBottom: 16 }}>
      <div>
        Amount: {amount}
      </div>
      <div>
        USD Value: {usdValue}
      </div>
      <div>
        Formatted Amount: {formattedAmount}
      </div>
    </div>
  )
}