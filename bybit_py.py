import math
from flask import Flask, render_template_string, request, jsonify
from pybit.unified_trading import HTTP

app = Flask(__name__)
API_KEY = "eyYKAYdWMEaXeSTEV8"
API_SECRET = "uFs3LxZ83ly6UhFz1RYSjQVKmmsJv2AZfZfT"
CATEGORY = "linear"
DEFAULT_SYMBOL = "ETHUSDT"

# === FIXED FOR DEMO ===
session = HTTP(
    testnet=False,
    demo=True,           # ← Critical for demo account
    api_key=API_KEY,
    api_secret=API_SECRET,
)

# Simple HTML template combining CSS, JS, and HTML in one file
HTML_TEMPLATE = """
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Bybit Minimalist Terminal</title>
    <style>
        :root {
            --bg-color: #121214;
            --card-bg: #1a1a1e;
            --accent: #ffb11a;
            --text: #ffffff;
            --text-dim: #8e8e93;
            --border: #2c2c35;
            --success: #00b074;
            --danger: #ff4d4d;
        }

        body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            background-color: var(--bg-color);
            color: var(--text);
            margin: 0;
            padding: 20px;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            box-sizing: border-box;
        }

        .container {
            width: 100%;
            max-width: 400px;
            background: var(--card-bg);
            border-radius: 16px;
            padding: 24px;
            box-shadow: 0 8px 32px rgba(0,0,0,0.4);
            border: 1px solid var(--border);
            position: relative;
            min-height: 420px;
        }

        .page {
            display: none;
        }

        .page.active {
            display: block;
        }

        h2 {
            margin-top: 0;
            font-size: 20px;
            font-weight: 600;
            margin-bottom: 20px;
            letter-spacing: -0.5px;
        }

        .input-group {
            margin-bottom: 16px;
        }

        label {
            display: block;
            font-size: 12px;
            color: var(--text-dim);
            margin-bottom: 6px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }

        input {
            width: 100%;
            padding: 12px;
            background: #222227;
            border: 1px solid var(--border);
            border-radius: 8px;
            color: white;
            font-size: 16px;
            box-sizing: border-box;
            outline: none;
            transition: border 0.2s;
        }

        input:focus {
            border-color: var(--accent);
        }

        .calc-info {
            font-size: 13px;
            color: var(--text-dim);
            margin-top: 4px;
            display: flex;
            justify-content: space-between;
        }

        .btn-group {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 12px;
            margin-top: 24px;
        }

        button.trade-btn {
            padding: 14px;
            border: none;
            border-radius: 8px;
            font-size: 16px;
            font-weight: 600;
            cursor: pointer;
            transition: opacity 0.2s;
        }

        button.trade-btn:hover {
            opacity: 0.9;
        }

        button.buy { background-color: var(--success); color: white; }
        button.sell { background-color: var(--danger); color: white; }

        /* Floating Toggle Button */
        .toggle-btn {
            position: fixed;
            bottom: 24px;
            left: 24px;
            width: 50px;
            height: 50px;
            border-radius: 50%;
            background: var(--accent);
            border: none;
            cursor: pointer;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            display: flex;
            justify-content: center;
            align-items: center;
            transition: transform 0.2s;
            z-index: 1000;
        }

        .toggle-btn:hover {
            transform: scale(1.05);
        }

        .toggle-btn svg {
            width: 24px;
            height: 24px;
            fill: #000;
        }

        /* Position Dashboard Styling */
        .position-card {
            background: #222227;
            border-radius: 8px;
            padding: 16px;
            margin-bottom: 12px;
            border-left: 4px solid var(--border);
        }
        .position-card.long { border-left-color: var(--success); }
        .position-card.short { border-left-color: var(--danger); }

        .pos-header {
            display: flex;
            justify-content: space-between;
            font-weight: bold;
            margin-bottom: 8px;
        }
        .pos-row {
            display: flex;
            justify-content: space-between;
            font-size: 14px;
            margin-bottom: 4px;
            color: var(--text-dim);
        }
        .pos-value { color: var(--text); }
        
        .pnl-green { color: var(--success); }
        .pnl-red { color: var(--danger); }
        
        .no-positions {
            color: var(--text-dim);
            text-align: center;
            margin-top: 40px;
        }
    </style>
</head>
<body>

    <div class="container">
        <div id="order-page" class="page active">
            <h2>Place Limit Order</h2>
                        <div id="balance-info" style="font-size:13px; color:#8e8e93; margin-bottom:16px; text-align:right;">
                Balance: Loading...
            </div>
            
            <div class="input-group">
                <label>Symbol</label>
                <input type="text" id="symbol" value="BTCUSDT" oninput="calculateAmount()">
            </div>

            <div style="display: flex; gap: 6px; margin-bottom: 16px; flex-wrap: wrap;">
                <button onclick="setSymbol('BTCUSDT')" style="padding:6px 10px; font-size:13px; background:#333; border:1px solid #444; color:white; border-radius:6px; cursor:pointer;">BTC</button>
                <button onclick="setSymbol('ETHUSDT')" style="padding:6px 10px; font-size:13px; background:#333; border:1px solid #444; color:white; border-radius:6px; cursor:pointer;">ETH</button>
                <button onclick="setSymbol('DOGEUSDT')" style="padding:6px 10px; font-size:13px; background:#333; border:1px solid #444; color:white; border-radius:6px; cursor:pointer;">DOGE</button>
                <button onclick="setSymbol('SOLUSDT')" style="padding:6px 10px; font-size:13px; background:#333; border:1px solid #444; color:white; border-radius:6px; cursor:pointer;">SOL</button>
            </div>

            <div class="input-group">
                <label>Limit Price (USDT)</label>
                <input type="number" id="price" step="any" placeholder="0.00" oninput="calculateAmount()">
            </div>

            <div class="input-group">
                <label>Invest Money (USDT)</label>
                <input type="number" id="invest" placeholder="0.00" oninput="calculateAmount()">
            </div>

            <div class="input-group">
                <label>Leverage</label>
                <input type="number" id="leverage" value="5" min="1" max="125" oninput="calculateAmount()">
            </div>

            <div class="calc-info">
                <span>Calculated Amount:</span>
                <span id="calc-amount" style="color: var(--accent); font-weight: bold;">0.0000</span>
            </div>

            <div class="btn-group">
                <button class="trade-btn buy" onclick="placeOrder('Buy')">Long</button>
                <button class="trade-btn sell" onclick="placeOrder('Sell')">Short</button>
            </div>
        </div>

        <div id="position-page" class="page">
            <h2>Current Positions</h2>
            <div id="positions-container">Loading positions...</div>
        </div>
    </div>

    <button class="toggle-btn" onclick="togglePage()" title="Switch View">
        <svg viewBox="0 0 24 24">
            <path d="M19 8l-4 4h3c0 3.31-2.69 6-6 6-1.01 0-1.97-.25-2.8-.7l-1.46 1.46C8.97 19.54 10.43 20 12 20c4.42 0 8-3.58 8-8h3l-4-4zM6 12c0-3.31 2.69-6 6-6 1.01 0 1.97.25 2.8.7l1.46-1.46C15.03 4.46 13.57 4 12 4c-4.42 0-8 3.58-8 8H1l4 4 4-4H6z"/>
        </svg>
    </button>

    <script>
        let currentPage = 'order';
                function setSymbol(sym) {
            document.getElementById('symbol').value = sym;
            calculateAmount();
        }

        async function loadBalance() {
            try {
                const res = await fetch('/api/balance');
                const data = await res.json();
                if (data.success) {
                    const total = parseFloat(data.totalEquity || 0).toFixed(2);
                    document.getElementById('balance-info').innerHTML = `Balance: <span style="color:#ffb11a; font-weight:bold;">$${total}</span>`;
                }
            } catch(e) {}
        }

        function togglePage() {
            const orderPage = document.getElementById('order-page');
            const positionPage = document.getElementById('position-page');
            
            if (currentPage === 'order') {
                orderPage.classList.remove('active');
                positionPage.classList.add('active');
                currentPage = 'position';
                fetchPositions();
            } else {
                positionPage.classList.remove('active');
                orderPage.classList.add('active');
                currentPage = 'order';
            }
        }

        // Auto convert Invested money + leverage -> Position size amount
        function calculateAmount() {
            const price = parseFloat(document.getElementById('price').value) || 0;
            const invest = parseFloat(document.getElementById('invest').value) || 0;
            const leverage = parseFloat(document.getElementById('leverage').value) || 1;
            
            if (price > 0 && invest > 0) {
                // Formula: (Invested Money * Leverage) / Limit Price
                const amount = (invest * leverage) / price;
                // Displayed raw estimate. Python script handles strict asset-decimal rounding.
                document.getElementById('calc-amount').innerText = amount.toFixed(4);
            } else {
                document.getElementById('calc-amount').innerText = "0.0000";
            }
        }

        function placeOrder(side) {
            const symbol = document.getElementById('symbol').value.toUpperCase();
            const price = document.getElementById('price').value;
            const invest = document.getElementById('invest').value;
            const leverage = document.getElementById('leverage').value;

            if(!price || !invest) {
                alert("Please fill in price and invest money amounts.");
                return;
            }

            fetch('/api/order', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ symbol, price, invest, leverage, side })
            })
            .then(res => res.json())
            .then(data => {
                if(data.success) {
                    alert(`Order successful! ID: ${data.orderId}`);
                } else {
                    alert(`Order failed: ${data.message}`);
                }
            })
            .catch(err => alert("Error communicating with server."));
        }

        function fetchPositions() {
            const container = document.getElementById('positions-container');
            container.innerHTML = "Loading...";

            fetch('/api/positions')
            .then(res => res.json())
            .then(data => {
                if (!data.success) {
                    container.innerHTML = `<div class="no-positions">Error: ${data.message}</div>`;
                    return;
                }
                
                if (data.positions.length === 0) {
                    container.innerHTML = '<div class="no-positions">No active positions.</div>';
                    return;
                }

                let html = '';
                data.positions.forEach(pos => {
                    const sideClass = pos.side === 'Buy' ? 'long' : 'short';
                    const sideText = pos.side === 'Buy' ? 'LONG' : 'SHORT';
                    const pnlClass = parseFloat(pos.unrealisedPnl) >= 0 ? 'pnl-green' : 'pnl-red';
                    
                    html += `
                        <div class="position-card ${sideClass}">
                            <div class="pos-header">
                                <span>${pos.symbol}</span>
                                <span class="${sideClass === 'long' ? 'pnl-green' : 'pnl-red'}">${sideText} ${pos.leverage}x</span>
                            </div>
                            <div class="pos-row"><span>Size:</span><span class="pos-value">${pos.size}</span></div>
                            <div class="pos-row"><span>Entry Price:</span><span class="pos-value">$${parseFloat(pos.avgPrice).toFixed(2)}</span></div>
                            <div class="pos-row"><span>Mark Price:</span><span class="pos-value">$${parseFloat(pos.markPrice).toFixed(2)}</span></div>
                            <div class="pos-row"><span>Unrealized PnL:</span><span class="pos-value ${pnlClass}">${parseFloat(pos.unrealisedPnl).toFixed(2)} USDT</span></div>
                        </div>
                    `;
                });
                container.innerHTML = html;
            })
            .catch(err => {
                container.innerHTML = '<div class="no-positions">Failed to fetch positions.</div>';
            });
        }
        
                window.onload = loadBalance;
    </script>
</body>
</html>
"""

# --- AUXILIARY FUNCTIONS TO FETCH INSTRUMENT RULES ---
def get_qty_step_and_precision(symbol):
    """Fetches valid decimal truncation rules required by Bybit for a specific symbol."""
    try:
        response = session.get_instruments_info(category=CATEGORY, symbol=symbol)
        list_info = response.get('result', {}).get('list', [])
        if list_info:
            qty_filter = list_info[0].get('lotSizeFilter', {})
            qty_step = float(qty_filter.get('qtyStep', '0.001'))
            # Calculate decimal places needed from qtyStep string
            decimal_places = 0 if qty_step >= 1 else int(-math.log10(qty_step))
            return qty_step, decimal_places
    except Exception:
        pass
    return 0.001, 3 # Fallback standard default for BTC

# --- ROUTING ---
@app.route('/')
def index():
    return render_template_string(HTML_TEMPLATE)

@app.route('/api/order', methods=['POST'])
def place_limit_order():
    data = request.json
    symbol = data.get('symbol', DEFAULT_SYMBOL)
    price = float(data.get('price'))
    invest = float(data.get('invest'))
    leverage = int(data.get('leverage', 5))
    side = data.get('side') # 'Buy' or 'Sell'

    try:
        # 1. Update leverage settings dynamically for the pair
        try:
            session.set_leverage(category=CATEGORY, symbol=symbol, buyLeverage=str(leverage), sellLeverage=str(leverage))
        except Exception as lev_err:
            # Often fails if leverage is already matching current configuration; skip and proceed
            pass

        # 2. Convert invested margin capacity to exact coin/contract sizing 
        raw_qty = (invest * leverage) / price
        
        # Adjust size constraints strictly to asset regulations matching Bybit specifications
        qty_step, precision = get_qty_step_and_precision(symbol)
        qty = math.floor(raw_qty / qty_step) * qty_step
        qty = round(qty, precision)

        if qty <= 0:
            return jsonify({'success': False, 'message': 'Calculated target quantity is zero. Increase position sizing.'})

        # 3. Finalize limit order command placement
        order = session.place_order(
            category=CATEGORY,
            symbol=symbol,
            side=side,
            orderType="Limit",
            qty=str(qty),
            price=str(price),
            timeInForce="PostOnly"
        )
        
        return jsonify({'success': True, 'orderId': order['result']['orderId']})

    except Exception as e:
        return jsonify({'success': False, 'message': str(e)})

@app.route('/api/positions', methods=['GET'])
def get_positions():
    try:
        response = session.get_positions(category=CATEGORY, settleCoin="USDT")
        raw_positions = response.get('result', {}).get('list', [])
        
        # Filter out theoretical data records with zero units actively held
        active_positions = [p for p in raw_positions if float(p.get('size', 0)) > 0]
        
        return jsonify({'success': True, 'positions': active_positions})
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)})

@app.route('/api/balance', methods=['GET'])
def get_balance():
    try:
        response = session.get_wallet_balance(accountType="UNIFIED")
        total = response.get('result', {}).get('list', [{}])[0].get('totalEquity', '0')
        return jsonify({'success': True, 'totalEquity': total})
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)})
if __name__ == '__main__':
    # Starts local instance accessible natively via your mac browser
    print("Starting minimalist Bybit interface on http://127.0.0.1:5000")
    app.run(debug=True, port=5000)