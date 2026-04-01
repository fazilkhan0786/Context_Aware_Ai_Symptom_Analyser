# 🧠 AI-Powered Symptom Analyzer (Groq Edition)

> **Created & Maintained by [Fazilkhan Malek](https://github.com/fazilkhan0786)**  
> Part of the NuroVed healthcare innovation initiative under the Promacle vision.

An intelligent and bilingual web application that allows users to describe their symptoms and receive an AI-generated preliminary health analysis using the Groq API.

---

## 👨‍💼 Original Creator & Project Ownership

**This project was created and is maintained by Fazilkhan Malek**

- **GitHub**: https://github.com/fazilkhan0786
- **Email**: malekfazilkhan07@gmail.com
- **License**: MIT with Attribution (see [LICENSE](./LICENSE))

All contributions to this project must include proper attribution to the original creator. While derivative works are permitted under the MIT license, attribution to Fazilkhan Malek as the original author is required.

This project represents an early-stage module within NuroVed’s broader mission:
Rebuilding healthcare around continuity, intelligence, and patient-centered digital infrastructure.

🏥 About the Project

The AI Symptom Analyzer is not just a standalone tool. It is a foundational prototype within the NuroVed ecosystem, designed to:

Explore AI-assisted preliminary health assessment

Improve patient awareness before clinical visits

Reduce information gaps between patients and healthcare providers

Demonstrate scalable AI integration in healthcare systems

⚠️ Disclaimer:
This tool provides AI-generated informational insights and is not a substitute for professional medical advice, diagnosis, or treatment.

✨ Features

🩺 AI Symptom Analysis (via Groq API)
Enter or speak your symptoms and receive AI-powered health insights using Groq’s high-performance LLM.

🎙️ Voice Input
Hands-free symptom description using browser-based speech recognition.

🔊 Text-to-Speech Output
AI responses can be spoken aloud using the browser’s SpeechSynthesis API.

🌓 Dark/Light Themes
Seamless UI experience with theme switching.

🌐 Bilingual Interface (English & Arabic)
Designed for accessibility across language barriers.

🧩 Technologies Used
Technology	Purpose
Next.js	React framework for scalable and performant web applications
TypeScript	Strong typing and maintainable code architecture
Tailwind CSS	Utility-first responsive UI design
shadcn/ui	Accessible, modern UI components
Lucide React	Minimal and clean icon system
Groq API	AI reasoning engine powering symptom analysis
🎯 Strategic Context (Within NuroVed)

Within the NuroVed healthcare ecosystem, this module contributes to:

Early patient interaction layer

AI-assisted triage experiments

Data structuring for future medical continuity systems

Trust-building layer before hospital integration

This is an experimental but strategically aligned component toward building:

Intelligent, connected, and longitudinal healthcare infrastructure.

⚙️ Getting Started
✅ Prerequisites

Node.js (v18 or higher)

npm

Update npm if required:

npm install npm@latest -g

🚀 Installation

Clone the repository:

git clone https://github.com/fazilkhan0786/Context_Aware_Ai_Symptom_Analyser.git
cd Context_Aware_Ai_Symptom_Analyser


Install dependencies:

npm install


Create a .env.local file in the root directory and add your Groq API key:

NEXT_PUBLIC_GROQ_API_KEY=your_groq_api_key_here


Run the development server:

npm run dev


Open:

http://localhost:3000

💡 Usage

Enter or speak your symptoms.

Click Analyze Symptoms.

Review AI-generated insights.

Use 🔊 to listen to results.

Switch between 🌙 / ☀️ themes.

Toggle between 🇬🇧 English and 🇸🇦 Arabic.

🐳 Deployment
Docker

Build:

docker build -t ai-symptom-analyzer .


Run:

docker run -p 3000:3000 ai-symptom-analyzer


Or:

docker compose up

Kubernetes

Deploy:

kubectl apply -f deployment.yaml -f service.yaml

⚡ CI/CD Pipeline

The project includes a GitHub Actions workflow (.github/workflows/main.yml) that automates:

✅ Build & testing on every push

🐳 Docker image creation and publishing

🚀 Kubernetes deployment

👤 Author & Ownership

**Original Creator**: Fazilkhan Malek
**Project**: AI Symptom Analyzer (NuroVed Initiative)
**Parent Vision**: Promacle

This is an early-stage innovation module contributing toward the long-term vision of intelligent, AI-integrated healthcare systems.

### Licensing & Attribution

This project is licensed under the **MIT License with an Attribution Clause**. This means:

✅ **You can**:
- Use this code in your projects (commercial or personal)
- Modify and distribute the code
- Sublicense under the same terms

⚠️ **You must**:
- Include the copyright notice: "Copyright (c) 2026 Fazilkhan Malek"
- Provide clear attribution to Fazilkhan Malek as the original creator
- Include a reference to this license in README files and code comments
- Maintain attribution in derivative works

📄 For complete license details, see the [LICENSE](./LICENSE) file.

### Contact & Support

- **Questions about licensing?** Email: malekfazilkhan07@gmail.com
- **GitHub**: https://github.com/fazilkhan0786
- **Report issues or contribute**: https://github.com/fazilkhan0786/Context_Aware_Ai_Symptom_Analyser/issues

---
