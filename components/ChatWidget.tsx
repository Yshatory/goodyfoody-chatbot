"use client";

import { useState, useRef, useEffect } from "react";
import type { CSSProperties, ReactNode } from "react";

type Step =
  | "home"
  | "bestelling"
  | "bestelling_actief"
  | "wijzigen"
  | "wijzigen_actief"
  | "maaltijdadvies"
  | "maaltijdadvies_result"
  | "bmi"
  | "calorieen"
  | "allergenen"
  | "anderevraag";

const box: CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: 10,
  marginTop: 12,
};

const button: CSSProperties = {
  background: "#fbeaea",
  color: "#111111",
  fontSize: 14,
  fontWeight: 700,
  padding: "8px 14px",
  borderRadius: 10,
  border: "1px solid #6f0000",
  cursor: "pointer",
  width: "fit-content",
  alignSelf: "center",
  textAlign: "center",
};

type Message = {
  role: "user" | "bot";
  text: ReactNode;
};

const N8N_WEBHOOK_URL = "https://n8n.kemetops.cloud/webhook/GoodyFoody";

export default function ChatWidget() {
  const [step, setStep] = useState<Step>("home");
  const [userInput, setUserInput] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const [showRestart, setShowRestart] = useState(false);
  const sessionIdRef = useRef(
    (typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random()}`) as string
  );

  const [messages, setMessages] = useState<Message[]>([
    {
      role: "bot",
      text: "Hey 👋 Welkom bij The Goody Foody! Waarmee kan ik je helpen?",
    },
  ]);

  const sendToN8n = (payload: {
    sessionId: string;
    intent: string;
    step: Step;
    text?: string;
  }) => {
    if (!N8N_WEBHOOK_URL || N8N_WEBHOOK_URL.includes("JOUW_N8N_WEBHOOK_URL")) return;
    fetch(N8N_WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }).catch(() => {});
  };

  const typeBotMessage = (text: string, delay = 6) => {
    setMessages((p) => [...p, { role: "bot", text: "" }]);
    let i = 0;
    const interval = setInterval(() => {
      i++;
      setMessages((p) => {
        const last = p[p.length - 1];
        if (last.role !== "bot") return p;
        const updated = [...p];
        updated[updated.length - 1] = { ...last, text: text.slice(0, i) };
        return updated;
      });
      if (i >= text.length) clearInterval(interval);
    }, delay);
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, step]);

  return (
    <>
      {/* CLOSED WIDGET */}
      {!isOpen && (
        <div
          style={{
            position: "fixed",
            bottom: 24,
            right: 24,
            display: "flex",
            alignItems: "center",
            gap: 10,
            zIndex: 9998,
          }}
        >
          <div
            style={{
              background: "#ffffff",
              color: "#111",
              padding: "8px 12px",
              borderRadius: 12,
              fontSize: 13,
              fontWeight: 500,
              boxShadow: "0 6px 18px rgba(0,0,0,0.12)",
              whiteSpace: "nowrap",
            }}
          >
            Hulp nodig?
          </div>
          <div
            onClick={() => setIsOpen(true)}
            style={{
              width: 56,
              height: 56,
              borderRadius: "50%",
              background: "#8B0000",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              boxShadow: "0 8px 24px rgba(0,0,0,0.25)",
            }}
          >
            <img
              src="/chef-avatar.png"
              alt="Chef"
              style={{ width: 36, height: 36, borderRadius: "50%", background: "#fff" }}
            />
          </div>
        </div>
      )}

      {/* OPEN WIDGET */}
      {isOpen && (
        <div
          style={{
            position: "fixed",
            bottom: 60,
            right: 24,
            width: 420,
            height: 680,
            maxHeight: "85vh",
            background: "#f7f7f7",
            borderRadius: 18,
            boxShadow: "0 20px 60px rgba(0,0,0,.35)",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            fontFamily: "Arial, sans-serif",
            zIndex: 9999,
          }}
        >
          {/* HEADER */}
          <div
            style={{
              background: "#8B0000",
              color: "#fff",
              padding: "14px 16px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <img
                src="/circle-logo-tgf.png"
                alt="The Goody Foody"
                style={{ width: 36, height: 36, borderRadius: "50%" }}
              />
              <div>
                <div style={{ fontWeight: 600 }}>Klanten Service</div>
                <div style={{ fontSize: 12, opacity: 0.85 }}>The Goody Foody 24/7</div>
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <button
                onClick={() => setShowRestart(true)}
                onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.15)")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                style={{
                  background: "transparent",
                  border: "none",
                  color: "#fff",
                  fontSize: 20,
                  cursor: "pointer",
                  borderRadius: 8,
                  padding: "6px 8px",
                  lineHeight: 1,
                }}
              >
                ↺
              </button>
              <button
                onClick={() => setIsOpen(false)}
                onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.15)")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                style={{
                  background: "transparent",
                  border: "none",
                  color: "#fff",
                  fontSize: 20,
                  cursor: "pointer",
                  borderRadius: 8,
                  padding: "6px 8px",
                  lineHeight: 1,
                }}
              >
                ✕
              </button>
            </div>
          </div>

          {/* BODY */}
          <div
            className="bs-body"
            style={{
              flex: 1,
              padding: 16,
              overflowY: "auto",
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            }}
          >
            <style>
              {`
                .bs-body::-webkit-scrollbar { display: none; }
              `}
            </style>
            {messages.map((m, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "flex-end",
                  justifyContent: m.role === "user" ? "flex-end" : "flex-start",
                  gap: 8,
                  marginBottom: 10,
                }}
              >
                {m.role === "bot" && (
                  <img
                    src="/chef-avatar.png"
                    alt="Chef"
                    style={{ width: 32, height: 32, borderRadius: "50%" }}
                  />
                )}
                <div
                  style={{
                    background: m.role === "user" ? "#8B0000" : "#ffffff",
                    color: m.role === "user" ? "#ffffff" : "#000000",
                    padding: "10px 14px",
                    borderRadius: m.role === "user" ? "18px 18px 0 18px" : "18px 18px 18px 0",
                    maxWidth: "75%",
                    fontSize: 14,
                    lineHeight: "1.4",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                  }}
                >
                  {m.text}
                </div>
              </div>
            ))}
            <div ref={bottomRef} />

            {/* HOME */}
            {step === "home" && (
              <div style={box}>
                {[
                  {
                    label: "📦 Bestelling",
                    onClick: () => {
                      setMessages((p) => [...p, { role: "user", text: "📦 Bestelling" }]);
                      sendToN8n({ sessionId: sessionIdRef.current, intent: "menu_order", step: "home" });
                      typeBotMessage("Waarmee kan ik je helpen met je bestelling? 🙂");
                      setStep("bestelling");
                    },
                  },
                  {
                    label: "⚠️ Allergeneninformatie",
                    onClick: () => {
                      setMessages((p) => [...p, { role: "user", text: "⚠️ Allergeneninformatie" }]);
                      sendToN8n({ sessionId: sessionIdRef.current, intent: "menu_allergens", step: "home" });
                      typeBotMessage(
                        "Bij The Goody Foody staan kwaliteit en jouw gezondheid centraal! 💪\n\n" +
                          "✅ Onze maaltijden bevatten hoge porties eiwitten.\n" +
                          "👨‍🍳 Bereid door meesterchefkoks.\n" +
                          "🟢 100% halal.\n\n" +
                          "Over welk gerecht wil je info?",
                        20
                      );
                      setStep("allergenen");
                    },
                  },
                  {
                    label: "🥗 Maaltijdadvies",
                    onClick: () => {
                      setMessages((p) => [...p, { role: "user", text: "🥗 Maaltijdadvies" }]);
                      sendToN8n({ sessionId: sessionIdRef.current, intent: "menu_meal_advice", step: "home" });
                      typeBotMessage("Wat is je doel? 🙂");
                      setStep("maaltijdadvies");
                    },
                  },
                  {
                    label: "📊 BMI berekenen",
                    onClick: () => {
                      setMessages((p) => [
                        ...p,
                        { role: "user", text: "📊 BMI berekenen" },
                        {
                          role: "bot",
                          text: (
                            <>
                              ⚖️ Je BMI berekenen?<br />
                              👉{" "}
                              <a
                                href="https://www.thegoodyfoody.com/nl-be/pages/bmi"
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{ color: "#1a73e8", fontWeight: 600, textDecoration: "underline" }}
                              >
                                Ga naar de BMI-calculator
                              </a>
                            </>
                          ),
                        },
                      ]);
                      sendToN8n({ sessionId: sessionIdRef.current, intent: "menu_bmi", step: "home" });
                      setStep("bmi");
                    },
                  },
                  {
                    label: "🔥 Calorieën berekenen",
                    onClick: () => {
                      setMessages((p) => [
                        ...p,
                        { role: "user", text: "🔥 Calorieën berekenen" },
                        {
                          role: "bot",
                          text: (
                            <>
                              🔥 Caloriebehoefte berekenen?<br />
                              👉{" "}
                              <a
                                href="https://www.thegoodyfoody.com/nl-be/pages/calorie-calculator"
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{ color: "#1a73e8", fontWeight: 600, textDecoration: "underline" }}
                              >
                                Caloriecalculator openen
                              </a>
                            </>
                          ),
                        },
                      ]);
                      sendToN8n({ sessionId: sessionIdRef.current, intent: "menu_calories", step: "home" });
                      setStep("calorieen");
                    },
                  },
                  {
                    label: "💬 Andere vraag",
                    onClick: () => {
                      setMessages((p) => [...p, { role: "user", text: "💬 Andere vraag" }]);
                      sendToN8n({ sessionId: sessionIdRef.current, intent: "menu_other", step: "home" });
                      typeBotMessage("Waarmee kan ik je helpen 🙂");
                      setStep("anderevraag");
                    },
                  },
                ].map((item, i) => (
                  <button
                    key={i}
                    style={button}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = "#8B0000";
                      e.currentTarget.style.border = "1.5px solid #8B0000";
                      e.currentTarget.style.color = "#ffffff";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "#fdecec";
                      e.currentTarget.style.border = "1.5px solid #7a0000";
                      e.currentTarget.style.color = "#111111";
                    }}
                    onClick={item.onClick}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            )}

            {/* BESTELLING */}
            {step === "bestelling" && (
              <div style={box}>
                {[
                  {
                    label: "📦 Status van mijn bestelling",
                    onClick: () => {
                      setMessages((p) => [...p, { role: "user", text: "📦 Status van mijn bestelling" }]);
                      sendToN8n({
                        sessionId: sessionIdRef.current,
                        intent: "order_status_start",
                        step: "bestelling",
                      });
                      typeBotMessage(
                        "Wat is uw bestelnummer?\n(U vindt het in de bevestigingsmail. Het begint met #TGF24 🙂)",
                        12
                      );
                      setStep("bestelling_actief");
                    },
                  },
                  {
                    label: "✏️ Iets wijzigen",
                    onClick: () => {
                      setMessages((p) => [...p, { role: "user", text: "✏️ Iets wijzigen" }]);
                      sendToN8n({
                        sessionId: sessionIdRef.current,
                        intent: "order_change_start",
                        step: "bestelling",
                      });
                      setStep("wijzigen");
                    },
                  },
                  {
                    label: "❌ Bestelling annuleren",
                    onClick: () => {
                      setMessages((p) => [...p, { role: "user", text: "❌ Bestelling annuleren" }]);
                      sendToN8n({
                        sessionId: sessionIdRef.current,
                        intent: "order_cancel_start",
                        step: "bestelling",
                      });
                      typeBotMessage(
                        "Wat is uw bestelnummer?\n(U vindt het in de bevestigingsmail. Het begint met #TGF24 🙂)",
                        12
                      );
                      setStep("bestelling_actief");
                    },
                  },
                  {
                    label: "❓ Geen bevestiging ontvangen",
                    onClick: () => {
                      setMessages((p) => [...p, { role: "user", text: "❓ Geen bevestiging ontvangen" }]);
                      sendToN8n({
                        sessionId: sessionIdRef.current,
                        intent: "order_no_confirmation",
                        step: "bestelling",
                      });
                      typeBotMessage(
                        "✅ Check zeker eerst je spamfolder.\nOp welke naam heeft u besteld?\n(Gelieve uw volledige naam op te geven 🙂)",
                        12
                      );
                      setStep("bestelling_actief");
                    },
                  },
                  {
                    label: "💬 Andere vraag over bestelling",
                    onClick: () => {
                      setMessages((p) => [...p, { role: "user", text: "💬 Andere vraag over bestelling" }]);
                      sendToN8n({
                        sessionId: sessionIdRef.current,
                        intent: "order_other_question",
                        step: "bestelling",
                      });
                      typeBotMessage(
                        "Geen probleem 🙂\nKun je kort uitleggen waar je vraag over gaat?\nVermeld indien mogelijk ook je bestelnummer (#TGF24).",
                        12
                      );
                      setStep("bestelling_actief");
                    },
                  },
                ].map((item, i) => (
                  <button
                    key={i}
                    style={button}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = "#8B0000";
                      e.currentTarget.style.border = "1.5px solid #8B0000";
                      e.currentTarget.style.color = "#ffffff";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "#fdecec";
                      e.currentTarget.style.border = "1.5px solid #7a0000";
                      e.currentTarget.style.color = "#111111";
                    }}
                    onClick={item.onClick}
                  >
                    {item.label}
                  </button>
                ))}
                <button
                  style={button}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "#4F8DFF";
                    e.currentTarget.style.border = "1.5px solid #4F8DFF";
                    e.currentTarget.style.color = "#ffffff";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "#fdecec";
                    e.currentTarget.style.border = "1.5px solid #7a0000";
                    e.currentTarget.style.color = "#111111";
                  }}
                  onClick={() => {
                    setMessages((p) => [...p, { role: "user", text: "↩️ Terug" }]);
                    sendToN8n({ sessionId: sessionIdRef.current, intent: "back_home", step: "bestelling" });
                    setStep("home");
                  }}
                >
                  ↩️ Terug
                </button>
              </div>
            )}

            {step === "bestelling_actief" && (
              <div style={box}>
                <button
                  style={button}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "#4F8DFF";
                    e.currentTarget.style.border = "1.5px solid #4F8DFF";
                    e.currentTarget.style.color = "#ffffff";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "#fdecec";
                    e.currentTarget.style.border = "1.5px solid #7a0000";
                    e.currentTarget.style.color = "#111111";
                  }}
                  onClick={() => {
                    setMessages((p) => [...p, { role: "user", text: "↩️ Terug" }]);
                    sendToN8n({ sessionId: sessionIdRef.current, intent: "back_order_menu", step: "bestelling_actief" });
                    setStep("bestelling");
                  }}
                >
                  ↩️ Terug
                </button>
              </div>
            )}

            {/* WIJZIGEN */}
            {step === "wijzigen" && (
              <div style={box}>
                <strong>Wat wil je wijzigen?</strong>
                <button
                  style={button}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "#8B0000";
                    e.currentTarget.style.border = "1.5px solid #8B0000";
                    e.currentTarget.style.color = "#ffffff";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "#fdecec";
                    e.currentTarget.style.border = "1.5px solid #7a0000";
                    e.currentTarget.style.color = "#111111";
                  }}
                  onClick={() => {
                    setMessages((p) => [...p, { role: "user", text: "📦 Adres wijzigen" }]);
                    sendToN8n({
                      sessionId: sessionIdRef.current,
                      intent: "order_change_address",
                      step: "wijzigen",
                    });
                    typeBotMessage(
                      "Wat is uw bestelnummer?\n(U vindt het in de bevestigingsmail. Het begint met #TGF24 🙂)\n\nIk kijk meteen of wijzigen nog mogelijk is.",
                      12
                    );
                    setStep("wijzigen_actief");
                  }}
                >
                  📦 Adres wijzigen
                </button>
                <button
                  style={button}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "#8B0000";
                    e.currentTarget.style.border = "1.5px solid #8B0000";
                    e.currentTarget.style.color = "#ffffff";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "#fdecec";
                    e.currentTarget.style.border = "1.5px solid #7a0000";
                    e.currentTarget.style.color = "#111111";
                  }}
                  onClick={() => {
                    setMessages((p) => [...p, { role: "user", text: "🍽️ Product wijzigen" }]);
                    sendToN8n({
                      sessionId: sessionIdRef.current,
                      intent: "order_change_product",
                      step: "wijzigen",
                    });
                    typeBotMessage(
                      "Wat is uw bestelnummer?\n(U vindt het in de bevestigingsmail. Het begint met #TGF24 🙂)\n\nIk kijk meteen of wijzigen nog mogelijk is.",
                      12
                    );
                    setStep("wijzigen_actief");
                  }}
                >
                  🍽️ Product wijzigen
                </button>
                <button
                  style={button}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "#4F8DFF";
                    e.currentTarget.style.border = "1.5px solid #4F8DFF";
                    e.currentTarget.style.color = "#ffffff";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "#fdecec";
                    e.currentTarget.style.border = "1.5px solid #7a0000";
                    e.currentTarget.style.color = "#111111";
                  }}
                  onClick={() => {
                    setMessages((p) => [...p, { role: "user", text: "↩️ Terug" }]);
                    sendToN8n({ sessionId: sessionIdRef.current, intent: "back_order_menu", step: "wijzigen" });
                    setStep("bestelling");
                  }}
                >
                  ↩️ Terug
                </button>
              </div>
            )}

            {step === "wijzigen_actief" && (
              <div style={box}>
                <button
                  style={button}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "#4F8DFF";
                    e.currentTarget.style.border = "1.5px solid #4F8DFF";
                    e.currentTarget.style.color = "#ffffff";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "#fdecec";
                    e.currentTarget.style.border = "1.5px solid #7a0000";
                    e.currentTarget.style.color = "#111111";
                  }}
                  onClick={() => {
                    setMessages((p) => [...p, { role: "user", text: "↩️ Terug" }]);
                    sendToN8n({ sessionId: sessionIdRef.current, intent: "back_change_menu", step: "wijzigen_actief" });
                    setStep("wijzigen");
                  }}
                >
                  ↩️ Terug
                </button>
              </div>
            )}

            {/* ALLERGENEN */}
            {step === "allergenen" && (
              <div style={box}>
                <p>Alle allergeneninformatie vind je per maaltijd op onze website.</p>
                <button
                  style={button}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "#4F8DFF";
                    e.currentTarget.style.border = "1.5px solid #4F8DFF";
                    e.currentTarget.style.color = "#ffffff";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "#fdecec";
                    e.currentTarget.style.border = "1.5px solid #7a0000";
                    e.currentTarget.style.color = "#111111";
                  }}
                  onClick={() => {
                    setMessages((p) => [...p, { role: "user", text: "↩️ Terug" }]);
                    sendToN8n({ sessionId: sessionIdRef.current, intent: "back_home", step: "allergenen" });
                    setStep("home");
                  }}
                >
                  ↩️ Terug
                </button>
              </div>
            )}

            {/* MAALTIJDADVIES */}
            {step === "maaltijdadvies" && (
              <div style={box}>
                <strong>Wat is je doel?</strong>
                {[
                  {
                    label: "⚖️ Afvallen",
                    url: "https://www.thegoodyfoody.com/nl-be/collections/afvallen-mealprep-maaltijden",
                    intent: "meal_advice_cut",
                  },
                  {
                    label: "📈 Aankomen",
                    url: "https://www.thegoodyfoody.com/nl-be/collections/aankomen-mealprep-maaltijden",
                    intent: "meal_advice_bulk",
                  },
                  {
                    label: "🔥 Droogtrainen",
                    url: "https://www.thegoodyfoody.com/nl-be/collections/droogtrainen-mealprep-maaltijden",
                    intent: "meal_advice_lean",
                  },
                  {
                    label: "⚖️ Gewicht behouden",
                    url: "https://www.thegoodyfoody.com/nl-be/collections/gezonde-mealprep-maaltijden",
                    intent: "meal_advice_maintain",
                  },
                ].map((x) => (
                  <button
                    key={x.intent}
                    style={button}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = "#8B0000";
                      e.currentTarget.style.border = "1.5px solid #8B0000";
                      e.currentTarget.style.color = "#ffffff";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "#fdecec";
                      e.currentTarget.style.border = "1.5px solid #7a0000";
                      e.currentTarget.style.color = "#111111";
                    }}
                    onClick={() => {
                      setMessages((p) => [
                        ...p,
                        { role: "user", text: x.label },
                        {
                          role: "bot",
                          text: (
                            <>
                              Bekijk hier onze{" "}
                              <a
                                href={x.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{ color: "#1a73e8", fontWeight: 600, textDecoration: "underline" }}
                              >
                                maaltijden
                              </a>
                              ! 🍽️🔥
                            </>
                          ),
                        },
                      ]);
                      sendToN8n({ sessionId: sessionIdRef.current, intent: x.intent, step: "maaltijdadvies" });
                      setStep("maaltijdadvies_result");
                    }}
                  >
                    {x.label}
                  </button>
                ))}
                <button
                  style={button}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "#4F8DFF";
                    e.currentTarget.style.border = "1.5px solid #4F8DFF";
                    e.currentTarget.style.color = "#ffffff";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "#fdecec";
                    e.currentTarget.style.border = "1.5px solid #7a0000";
                    e.currentTarget.style.color = "#111111";
                  }}
                  onClick={() => {
                    setMessages((p) => [...p, { role: "user", text: "↩️ Terug" }]);
                    sendToN8n({ sessionId: sessionIdRef.current, intent: "back_home", step: "maaltijdadvies" });
                    setStep("home");
                  }}
                >
                  ↩️ Terug
                </button>
              </div>
            )}

            {step === "maaltijdadvies_result" && (
              <div style={box}>
                <button
                  style={button}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "#4F8DFF";
                    e.currentTarget.style.border = "1.5px solid #4F8DFF";
                    e.currentTarget.style.color = "#ffffff";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "#fdecec";
                    e.currentTarget.style.border = "1.5px solid #7a0000";
                    e.currentTarget.style.color = "#111111";
                  }}
                  onClick={() => {
                    setMessages((p) => [...p, { role: "user", text: "↩️ Terug" }]);
                    sendToN8n({ sessionId: sessionIdRef.current, intent: "back_home", step: "maaltijdadvies_result" });
                    setStep("home");
                  }}
                >
                  ↩️ Terug
                </button>
              </div>
            )}

            {/* ANDERE VRAAG */}
            {step === "anderevraag" && (
              <div style={box}>
                <button
                  style={button}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "#4F8DFF";
                    e.currentTarget.style.border = "1.5px solid #4F8DFF";
                    e.currentTarget.style.color = "#ffffff";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "#fdecec";
                    e.currentTarget.style.border = "1.5px solid #7a0000";
                    e.currentTarget.style.color = "#111111";
                  }}
                  onClick={() => {
                    setMessages((p) => [...p, { role: "user", text: "↩️ Terug" }]);
                    sendToN8n({ sessionId: sessionIdRef.current, intent: "back_home", step: "anderevraag" });
                    setStep("home");
                  }}
                >
                  ↩️ Terug
                </button>
              </div>
            )}

            {/* BMI */}
            {step === "bmi" && (
              <div style={box}>
                <button
                  style={button}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "#4F8DFF";
                    e.currentTarget.style.border = "1.5px solid #4F8DFF";
                    e.currentTarget.style.color = "#ffffff";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "#fdecec";
                    e.currentTarget.style.border = "1.5px solid #7a0000";
                    e.currentTarget.style.color = "#111111";
                  }}
                  onClick={() => {
                    setMessages((p) => [...p, { role: "user", text: "↩️ Terug" }]);
                    sendToN8n({ sessionId: sessionIdRef.current, intent: "back_home", step: "bmi" });
                    setStep("home");
                  }}
                >
                  ↩️ Terug
                </button>
              </div>
            )}

            {/* CALORIEËN */}
            {step === "calorieen" && (
              <div style={box}>
                <button
                  style={button}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "#4F8DFF";
                    e.currentTarget.style.border = "1.5px solid #4F8DFF";
                    e.currentTarget.style.color = "#ffffff";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "#fdecec";
                    e.currentTarget.style.border = "1.5px solid #7a0000";
                    e.currentTarget.style.color = "#111111";
                  }}
                  onClick={() => {
                    setMessages((p) => [...p, { role: "user", text: "↩️ Terug" }]);
                    sendToN8n({ sessionId: sessionIdRef.current, intent: "back_home", step: "calorieen" });
                    setStep("home");
                  }}
                >
                  ↩️ Terug
                </button>
              </div>
            )}
          </div>

          {/* INPUT */}
          <div style={{ padding: 12, background: "#ffffff" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                border: userInput ? "2px solid #8B0000" : "1px solid #e5e5e5",
                borderRadius: 999,
                padding: "8px 12px",
                background: "#ffffff",
                boxShadow: "0 6px 18px rgba(0,0,0,0.08)",
              }}
            >
              <input
                placeholder="Typ je bericht…"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                style={{
                  flex: 1,
                  border: "none",
                  outline: "none",
                  fontSize: 14,
                  background: "transparent",
                  color: "#000",
                }}
              />
              <button
                onClick={() => {
                  const text = userInput.trim();
                  if (!text) return;
                  setMessages((p) => [...p, { role: "user", text }]);
                  sendToN8n({
                    sessionId: sessionIdRef.current,
                    intent: "user_message",
                    step,
                    text,
                  });
                  setUserInput("");
                }}
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: "50%",
                  background: userInput ? "#8B0000" : "#f0f0f0",
                  color: userInput ? "#ffffff" : "#999999",
                  border: "none",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 16,
                  cursor: userInput ? "pointer" : "default",
                }}
              >
                ↑
              </button>
            </div>
            <div
              style={{
                marginTop: 6,
                fontSize: 11,
                textAlign: "center",
                opacity: 0.6,
              }}
            >
              <a
                href="https://busyshark.agency"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  color: "#000",
                  fontWeight: 500,
                  textDecoration: "none",
                  transition: "all 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = "#4F8DFF";
                  e.currentTarget.style.textDecoration = "underline";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = "#000";
                  e.currentTarget.style.textDecoration = "none";
                }}
              >
                Powered by BusyShark
              </a>
            </div>
          </div>

          {/* FLOATING CLOSE BUTTON */}
          <div
            onClick={() => setIsOpen(false)}
            style={{
              position: "fixed",
              bottom: 12,
              right: 12,
              width: 44,
              height: 44,
              borderRadius: "50%",
              background: "#8B0000",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              boxShadow: "0 4px 16px rgba(0,0,0,0.2)",
              zIndex: 9999,
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#fff"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </div>

          {/* RESTART OVERLAY */}
          {showRestart && (
            <div
              onClick={() => setShowRestart(false)}
              style={{
                position: "absolute",
                inset: 0,
                zIndex: 50,
              }}
            >
              <div
                onClick={(e) => e.stopPropagation()}
                style={{
                  position: "absolute",
                  bottom: 80,
                  left: 0,
                  right: 0,
                  padding: 16,
                  background: "#ffffff",
                  boxShadow: "0 -6px 20px rgba(0,0,0,0.15)",
                  borderTopLeftRadius: 16,
                  borderTopRightRadius: 16,
                }}
              >
                <button
                  onClick={() => {
                    setMessages([
                      {
                        role: "bot",
                        text: "Hey 👋 Welkom bij The Goody Foody!\nWaarmee kan ik je helpen vandaag?",
                      },
                    ]);
                    sendToN8n({
                      sessionId: sessionIdRef.current,
                      intent: "restart_chat",
                      step,
                    });
                    setStep("home");
                    setUserInput("");
                    setShowRestart(false);
                  }}
                  style={{
                    width: "100%",
                    padding: "12px 16px",
                    borderRadius: 12,
                    border: "none",
                    background: "#8B0000",
                    color: "#fff",
                    fontSize: 14,
                    fontWeight: 600,
                    cursor: "pointer",
                    marginBottom: 8,
                  }}
                >
                  Start nieuwe chat
                </button>
                <button
                  onClick={() => setShowRestart(false)}
                  style={{
                    width: "100%",
                    padding: "12px 16px",
                    borderRadius: 12,
                    border: "none",
                    background: "#f0f0f0",
                    color: "#111",
                    fontSize: 14,
                    cursor: "pointer",
                  }}
                >
                  Annuleren
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}
