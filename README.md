# checkmateChris1-type ⌨️

**checkmateChris1-type** is a custom-built typing application inspired by [MonkeyType](https://monkeytype.com). It features multiple typing modes, real-time WPM tracking, and restart-on-tab functionality. Built for speed testing and muscle memory development.

## 🎯 Features

- **Typing Modes**:
  - **Word Mode**: Type the most common English words (`10`, `25`, `50`, or `100` word tests).
  - **Quote Mode**: Type quotes of varying lengths: `short`, `medium`, `long`, or `thicc`.
  - **Custom Mode** *(WIP)*: Will allow the user to input any custom text to type.

- **Real-Time Stats**: WPM and time update every second during typing.
- **Final WPM Update**: Accurate timing with one last update on completion.
- **Restart Anytime**: Press `Tab` to instantly restart the session.
- **Simple UI**: Clean, fast interface for distraction-free typing.

## 🛠️ Tech Stack

- **Frontend**: HTML, CSS, JavaScript
- **Backend**: Flask (Python)
- **Live Typing Logic**: JavaScript-driven with dynamic DOM updates

## 🚀 Getting Started

### Prerequisites

- Python 3.7+
- `Flask` and other dependencies

### Installation

```bash
git clone https://github.com/Checkmate-Chris1/checkmateChris1-type.git
cd checkmateChris1-type
pip install -r requirements.txt
python app.py
