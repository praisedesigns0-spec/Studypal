import { useState, useEffect, useRef, useCallback } from "react";

const WEEKLY_FREE_LIMIT = 30;
const PREMIUM_WEEKLY_LIMIT = 200;

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=Source+Serif+4:ital,wght@0,300;0,400;0,600;1,300;1,400&display=swap');

  * { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --navy: #1a2744;
    --navy-light: #243257;
    --gold: #c9a84c;
    --gold-light: #e8c97a;
    --cream: #f5f0e8;
    --cream-dark: #ede5d4;
    --text: #2c2c2c;
    --text-light: #6b6b6b;
    --white: #ffffff;
    --success: #2d6a4f;
    --error: #8b1a1a;
    --radius: 8px;
    --shadow: 0 4px 24px rgba(26,39,68,0.12);
    --shadow-lg: 0 8px 40px rgba(26,39,68,0.18);
  }

  body {
    font-family: 'Source Serif 4', Georgia, serif;
    background: var(--cream);
    color: var(--text);
    min-height: 100vh;
  }

  .app {
    max-width: 900px;
    margin: 0 auto;
    padding: 0 20px 60px;
  }

  /* HEADER */
  .header {
    background: var(--navy);
    margin: 0 -20px;
    padding: 18px 40px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 3px solid var(--gold);
  }
  .header-logo {
    display: flex;
    align-items: center;
    gap: 12px;
  }
  .header-icon {
    width: 36px;
    height: 36px;
    background: var(--gold);
    border-radius: 6px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 18px;
  }
  .header-title {
    font-family: 'Playfair Display', serif;
    font-size: 20px;
    color: var(--white);
    font-weight: 700;
    letter-spacing: 0.3px;
  }
  .header-subtitle {
    font-size: 10px;
    color: var(--gold-light);
    letter-spacing: 1.5px;
    text-transform: uppercase;
    margin-top: 2px;
  }

  /* HERO */
  .hero {
    text-align: center;
    padding: 52px 20px 36px;
    position: relative;
  }
  .hero::before {
    content: '';
    position: absolute;
    top: 0; left: 50%;
    transform: translateX(-50%);
    width: 320px;
    height: 2px;
    background: linear-gradient(90deg, transparent, var(--gold), transparent);
  }
  .hero-eyebrow {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    font-size: 11px;
    text-transform: uppercase;
    letter-spacing: 2.5px;
    color: var(--gold);
    font-weight: 600;
    margin-bottom: 18px;
  }
  .hero-eyebrow::before,
  .hero-eyebrow::after {
    content: '◆';
    font-size: 6px;
    opacity: 0.6;
  }
  .hero-name {
    font-family: 'Playfair Display', serif;
    font-size: clamp(52px, 10vw, 80px);
    font-weight: 700;
    color: var(--navy);
    line-height: 1;
    letter-spacing: -1px;
    margin-bottom: 6px;
    position: relative;
    display: inline-block;
  }
  .hero-name em {
    font-style: italic;
    color: var(--gold);
  }
  .hero-rule {
    width: 60px;
    height: 3px;
    background: var(--gold);
    margin: 20px auto 18px;
    border-radius: 2px;
  }
  .hero-tagline {
    font-size: 15px;
    color: var(--text-light);
    letter-spacing: 0.3px;
    line-height: 1.6;
    max-width: 360px;
    margin: 0 auto;
  }
  .plan-badge {
    display: flex;
    align-items: center;
    gap: 10px;
  }
  .badge {
    padding: 5px 14px;
    border-radius: 20px;
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 1px;
    text-transform: uppercase;
  }
  .badge-free {
    background: rgba(201,168,76,0.15);
    color: var(--gold-light);
    border: 1px solid rgba(201,168,76,0.3);
  }
  .badge-premium {
    background: var(--gold);
    color: var(--navy);
  }
  .upgrade-btn {
    background: transparent;
    border: 1px solid var(--gold);
    color: var(--gold);
    padding: 5px 14px;
    border-radius: 20px;
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 1px;
    text-transform: uppercase;
    cursor: pointer;
    transition: all 0.2s;
    font-family: inherit;
  }
  .upgrade-btn:hover { background: var(--gold); color: var(--navy); }

  /* QUOTA BAR */
  .quota-bar {
    background: var(--white);
    border: 1px solid var(--cream-dark);
    border-radius: var(--radius);
    padding: 14px 20px;
    margin: 24px 0 0;
    display: flex;
    align-items: center;
    gap: 16px;
  }
  .quota-label {
    font-size: 12px;
    color: var(--text-light);
    letter-spacing: 0.5px;
    white-space: nowrap;
    text-transform: uppercase;
  }
  .quota-track {
    flex: 1;
    height: 6px;
    background: var(--cream-dark);
    border-radius: 3px;
    overflow: hidden;
  }
  .quota-fill {
    height: 100%;
    background: var(--gold);
    border-radius: 3px;
    transition: width 0.4s ease;
  }
  .quota-fill.danger { background: var(--error); }
  .quota-count {
    font-size: 13px;
    font-weight: 600;
    color: var(--navy);
    white-space: nowrap;
  }

  /* TABS */
  .tabs {
    display: flex;
    gap: 0;
    margin: 28px 0 0;
    border-bottom: 2px solid var(--cream-dark);
  }
  .tab {
    padding: 12px 28px;
    font-family: 'Playfair Display', serif;
    font-size: 15px;
    font-weight: 600;
    color: var(--text-light);
    background: none;
    border: none;
    cursor: pointer;
    border-bottom: 3px solid transparent;
    margin-bottom: -2px;
    transition: all 0.2s;
    letter-spacing: 0.3px;
  }
  .tab:hover { color: var(--navy); }
  .tab.active { color: var(--navy); border-bottom-color: var(--gold); }

  /* UPLOAD SECTION */
  .upload-section { margin-top: 32px; }

  .upload-method-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
    margin-bottom: 24px;
  }
  .upload-card {
    border: 2px dashed var(--cream-dark);
    border-radius: var(--radius);
    padding: 36px 24px;
    text-align: center;
    background: var(--white);
    cursor: pointer;
    transition: all 0.22s;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
    position: relative;
    overflow: hidden;
  }
  .upload-card::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, transparent 60%, rgba(201,168,76,0.06));
    pointer-events: none;
  }
  .upload-card:hover {
    border-color: var(--gold);
    background: #fdf9f0;
    transform: translateY(-2px);
    box-shadow: var(--shadow);
  }
  .upload-card.active {
    border-color: var(--navy);
    background: #f0f2f7;
  }
  .upload-card-icon {
    width: 52px;
    height: 52px;
    border-radius: 50%;
    background: var(--cream);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 24px;
    margin-bottom: 4px;
    transition: background 0.2s;
  }
  .upload-card:hover .upload-card-icon { background: var(--cream-dark); }
  .upload-card-title {
    font-family: 'Playfair Display', serif;
    font-size: 16px;
    font-weight: 600;
    color: var(--navy);
  }
  .upload-card-desc {
    font-size: 12px;
    color: var(--text-light);
    line-height: 1.5;
  }
  .upload-input { display: none; }

  /* IMAGE PREVIEW */
  .image-preview-area {
    background: var(--white);
    border: 1px solid var(--cream-dark);
    border-radius: var(--radius);
    padding: 16px;
    margin-bottom: 16px;
  }
  .image-preview-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 12px;
  }
  .image-preview-label {
    font-size: 12px;
    text-transform: uppercase;
    letter-spacing: 1px;
    color: var(--text-light);
    font-weight: 600;
  }
  .image-preview-grid {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
  }
  .image-thumb {
    position: relative;
    width: 90px;
    height: 90px;
    border-radius: 6px;
    overflow: hidden;
    border: 1.5px solid var(--cream-dark);
  }
  .image-thumb img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  .image-thumb-remove {
    position: absolute;
    top: 3px;
    right: 3px;
    width: 20px;
    height: 20px;
    background: rgba(26,39,68,0.75);
    color: white;
    border-radius: 50%;
    border: none;
    cursor: pointer;
    font-size: 11px;
    display: flex;
    align-items: center;
    justify-content: center;
    line-height: 1;
  }
  .extracting-badge {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-size: 12px;
    color: var(--gold);
    font-weight: 600;
    padding: 4px 10px;
    background: rgba(201,168,76,0.1);
    border-radius: 12px;
    border: 1px solid rgba(201,168,76,0.3);
  }
  .dot-pulse {
    display: inline-flex;
    gap: 3px;
  }
  .dot-pulse span {
    width: 4px;
    height: 4px;
    border-radius: 50%;
    background: var(--gold);
    animation: dotPulse 1.2s ease-in-out infinite;
  }
  .dot-pulse span:nth-child(2) { animation-delay: 0.2s; }
  .dot-pulse span:nth-child(3) { animation-delay: 0.4s; }
  @keyframes dotPulse { 0%,80%,100% { opacity: 0.3; transform: scale(0.8); } 40% { opacity: 1; transform: scale(1); } }

  /* PERMISSION MODAL */
  .perm-modal-overlay {
    position: fixed;
    inset: 0;
    background: rgba(26,39,68,0.55);
    z-index: 300;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
  }
  .perm-modal {
    background: var(--white);
    border-radius: var(--radius);
    padding: 36px 32px;
    max-width: 400px;
    width: 100%;
    box-shadow: var(--shadow-lg);
    text-align: center;
  }
  .perm-icon-ring {
    width: 72px;
    height: 72px;
    border-radius: 50%;
    background: var(--cream);
    border: 3px solid var(--gold);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 30px;
    margin: 0 auto 18px;
  }
  .perm-title {
    font-family: 'Playfair Display', serif;
    font-size: 20px;
    font-weight: 700;
    color: var(--navy);
    margin-bottom: 10px;
  }
  .perm-desc {
    font-size: 14px;
    color: var(--text-light);
    line-height: 1.65;
    margin-bottom: 24px;
  }
  .perm-what-label {
    font-size: 11px;
    text-transform: uppercase;
    letter-spacing: 1px;
    color: var(--text-light);
    margin-bottom: 10px;
    font-weight: 600;
  }
  .perm-access-list {
    display: flex;
    flex-direction: column;
    gap: 8px;
    margin-bottom: 24px;
    text-align: left;
  }
  .perm-access-item {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 10px 14px;
    background: var(--cream);
    border-radius: 6px;
    font-size: 13px;
    color: var(--navy);
  }
  .perm-access-item span:first-child { font-size: 16px; }
  .perm-actions { display: flex; gap: 10px; justify-content: center; }
  .perm-denied-steps {
    background: var(--cream);
    border-radius: 6px;
    padding: 14px 16px;
    text-align: left;
    margin-bottom: 20px;
  }
  .perm-denied-steps ol {
    padding-left: 18px;
    font-size: 13px;
    color: var(--text);
    line-height: 2;
  }

  .permission-indicator {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    font-size: 11px;
    font-weight: 600;
    padding: 3px 9px;
    border-radius: 10px;
    margin-top: 8px;
  }
  .perm-granted { background: #e8f5ee; color: var(--success); }
  .perm-denied-badge { background: #fceaea; color: var(--error); }
  .perm-unknown { background: var(--cream); color: var(--text-light); }
  .camera-modal {
    position: fixed;
    inset: 0;
    background: rgba(10,14,26,0.92);
    z-index: 200;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 20px;
    padding: 20px;
  }
  .camera-video {
    width: 100%;
    max-width: 540px;
    border-radius: var(--radius);
    border: 2px solid var(--gold);
    background: #000;
    display: block;
  }
  .camera-controls {
    display: flex;
    gap: 14px;
    align-items: center;
  }
  .shutter-btn {
    width: 64px;
    height: 64px;
    border-radius: 50%;
    background: var(--white);
    border: 4px solid var(--gold);
    cursor: pointer;
    transition: all 0.15s;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 26px;
  }
  .shutter-btn:hover { transform: scale(1.07); background: var(--cream); }
  .camera-hint {
    color: rgba(255,255,255,0.55);
    font-size: 13px;
    text-align: center;
  }
  .canvas-hidden { display: none; }

  .or-divider {
    display: flex;
    align-items: center;
    gap: 16px;
    margin: 20px 0;
    color: var(--text-light);
    font-size: 13px;
  }
  .or-divider::before, .or-divider::after {
    content: '';
    flex: 1;
    height: 1px;
    background: var(--cream-dark);
  }
  textarea {
    width: 100%;
    min-height: 160px;
    padding: 16px;
    border: 1px solid var(--cream-dark);
    border-radius: var(--radius);
    font-family: 'Source Serif 4', serif;
    font-size: 14px;
    line-height: 1.7;
    color: var(--text);
    background: var(--white);
    resize: vertical;
    transition: border-color 0.2s;
    outline: none;
  }
  textarea:focus { border-color: var(--gold); }
  textarea::placeholder { color: #b0a89a; }

  @media (max-width: 520px) {
    .upload-method-grid { grid-template-columns: 1fr; }
  }

  /* BUTTONS */
  .btn {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 12px 28px;
    border-radius: var(--radius);
    font-family: 'Source Serif 4', serif;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    border: none;
    transition: all 0.2s;
    letter-spacing: 0.3px;
  }
  .btn-primary {
    background: var(--navy);
    color: var(--white);
  }
  .btn-primary:hover { background: var(--navy-light); transform: translateY(-1px); box-shadow: var(--shadow); }
  .btn-primary:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }
  .btn-gold {
    background: var(--gold);
    color: var(--navy);
  }
  .btn-gold:hover { background: var(--gold-light); transform: translateY(-1px); box-shadow: var(--shadow); }
  .btn-outline {
    background: transparent;
    color: var(--navy);
    border: 1.5px solid var(--navy);
  }
  .btn-outline:hover { background: var(--navy); color: var(--white); }
  .btn-sm { padding: 8px 18px; font-size: 13px; }

  .actions { display: flex; gap: 12px; margin-top: 20px; flex-wrap: wrap; }

  /* LOADING */
  .loading-state {
    text-align: center;
    padding: 60px 20px;
  }
  .spinner {
    width: 40px;
    height: 40px;
    border: 3px solid var(--cream-dark);
    border-top-color: var(--navy);
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
    margin: 0 auto 20px;
  }
  @keyframes spin { to { transform: rotate(360deg); } }
  .loading-text {
    font-family: 'Playfair Display', serif;
    font-size: 18px;
    color: var(--navy);
    margin-bottom: 8px;
  }
  .loading-sub { font-size: 13px; color: var(--text-light); }

  /* FLASHCARDS */
  .flashcards-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
    gap: 16px;
    margin-top: 28px;
  }
  .flashcard {
    background: var(--white);
    border: 1px solid var(--cream-dark);
    border-radius: var(--radius);
    padding: 24px;
    cursor: pointer;
    transition: all 0.3s;
    min-height: 160px;
    display: flex;
    flex-direction: column;
    position: relative;
    overflow: hidden;
  }
  .flashcard::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 3px;
    background: var(--gold);
    transform: scaleX(0);
    transition: transform 0.3s;
  }
  .flashcard:hover { box-shadow: var(--shadow); transform: translateY(-2px); }
  .flashcard:hover::before { transform: scaleX(1); }
  .flashcard.flipped { background: var(--navy); color: var(--white); }
  .flashcard.flipped .card-label { color: var(--gold); }
  .flashcard.flipped .card-text { color: var(--white); }
  .card-label {
    font-size: 10px;
    text-transform: uppercase;
    letter-spacing: 1.5px;
    color: var(--gold);
    font-weight: 600;
    margin-bottom: 10px;
  }
  .card-text {
    font-size: 14px;
    line-height: 1.65;
    color: var(--text);
    flex: 1;
  }
  .card-hint {
    font-size: 11px;
    color: var(--text-light);
    margin-top: 12px;
    text-align: right;
    font-style: italic;
  }
  .flashcard.flipped .card-hint { color: rgba(255,255,255,0.4); }

  .section-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 32px;
    padding-bottom: 12px;
    border-bottom: 1px solid var(--cream-dark);
  }
  .section-title {
    font-family: 'Playfair Display', serif;
    font-size: 22px;
    font-weight: 700;
    color: var(--navy);
  }
  .section-count {
    font-size: 13px;
    color: var(--text-light);
  }

  /* TEST */
  .test-section { margin-top: 32px; }
  .progress-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 8px;
  }
  .progress-label { font-size: 13px; color: var(--text-light); }
  .progress-fraction { font-size: 13px; font-weight: 600; color: var(--navy); }
  .progress-track {
    height: 4px;
    background: var(--cream-dark);
    border-radius: 2px;
    margin-bottom: 32px;
    overflow: hidden;
  }
  .progress-fill {
    height: 100%;
    background: linear-gradient(90deg, var(--navy), var(--gold));
    border-radius: 2px;
    transition: width 0.4s ease;
  }

  .question-card {
    background: var(--white);
    border: 1px solid var(--cream-dark);
    border-radius: var(--radius);
    padding: 36px;
    box-shadow: var(--shadow);
  }
  .question-number {
    font-size: 11px;
    text-transform: uppercase;
    letter-spacing: 1.5px;
    color: var(--gold);
    font-weight: 600;
    margin-bottom: 12px;
  }
  .question-text {
    font-family: 'Playfair Display', serif;
    font-size: 20px;
    font-weight: 600;
    color: var(--navy);
    line-height: 1.5;
    margin-bottom: 28px;
  }
  .options-list {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  .option {
    padding: 14px 18px;
    border: 1.5px solid var(--cream-dark);
    border-radius: var(--radius);
    cursor: pointer;
    font-size: 14px;
    line-height: 1.5;
    transition: all 0.2s;
    display: flex;
    align-items: flex-start;
    gap: 12px;
    background: var(--white);
    text-align: left;
    font-family: inherit;
    color: var(--text);
  }
  .option:hover:not(:disabled) { border-color: var(--navy); background: #f8f6f2; }
  .option.selected { border-color: var(--navy); background: #f0f2f7; }
  .option.correct { border-color: var(--success); background: #f0faf5; color: var(--success); }
  .option.wrong { border-color: var(--error); background: #fdf0f0; color: var(--error); }
  .option:disabled { cursor: default; }
  .option-letter {
    width: 24px;
    height: 24px;
    border-radius: 50%;
    border: 1.5px solid currentColor;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 11px;
    font-weight: 700;
    flex-shrink: 0;
    margin-top: 1px;
  }
  .feedback {
    margin-top: 18px;
    padding: 14px 18px;
    border-radius: var(--radius);
    font-size: 14px;
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .feedback.correct-fb { background: #f0faf5; color: var(--success); border: 1px solid #b7dfc9; }
  .feedback.wrong-fb { background: #fdf0f0; color: var(--error); border: 1px solid #e8b4b4; }
  .explanation { font-weight: 400; margin-top: 4px; font-size: 13px; }

  .next-btn-row { display: flex; justify-content: flex-end; margin-top: 20px; }

  /* RESULTS */
  .results-card {
    background: var(--white);
    border: 1px solid var(--cream-dark);
    border-radius: var(--radius);
    padding: 48px 40px;
    text-align: center;
    box-shadow: var(--shadow-lg);
    margin-top: 32px;
  }
  .results-score {
    font-family: 'Playfair Display', serif;
    font-size: 72px;
    font-weight: 700;
    color: var(--navy);
    line-height: 1;
    margin-bottom: 8px;
  }
  .results-label {
    font-size: 13px;
    text-transform: uppercase;
    letter-spacing: 1.5px;
    color: var(--text-light);
    margin-bottom: 28px;
  }
  .results-breakdown {
    display: flex;
