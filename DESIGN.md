---
version: "1.0"
name: "Tutora"
description: "Premium edu-tech platform — warm cream-navy palette, fluid typography, generously rounded UI for parent/student trust signals"
colors:
  primary: "#1a2238"
  primary-foreground: "#ffffff"
  secondary: "#3d4a3e"
  secondary-foreground: "#ffffff"
  accent: "#d4b483"
  accent-foreground: "#9c7127"
  destructive: "#631b1b"
  destructive-foreground: "#ffffff"
  background: "#faf9f6"
  surface: "#ffffff"
  surface-warm: "#f2f0e4"
  border: "#faf5ee"
  border-subtle: "rgba(26, 34, 56, 0.1)"
  muted: "#9ca3af"
  muted-strong: "#6b7280"
  overlay-navy-60: "rgba(26, 34, 56, 0.6)"
  overlay-navy-05: "rgba(26, 34, 56, 0.05)"
  success: "#059669"
  info: "#2563eb"
  warning: "#f97316"
typography:
  base:
    fontFamily: '"Bricolage Grotesque", system-ui, sans-serif'
    fontSize: "clamp(1rem, 0.9rem + 0.2vw, 1.25rem)"
    lineHeight: "1.5"
  heading:
    fontFamily: '"Bricolage Grotesque", system-ui, sans-serif'
    fontWeight: "700"
    letterSpacing: "-0.02em"
  serif:
    fontFamily: '"IBM Plex Serif", Georgia, serif'
  mono:
    fontFamily: '"IBM Plex Mono", monospace'
rounded:
  xs: "3.5px"
  sm: "10.5px"
  md: "14px"
  lg: "21px"
  xl: "28px"
  2xl: "42px"
  3xl: "56px"
  full: "9999px"
spacing:
  xs: "clamp(0.25rem, 0.2rem + 0.1vw, 0.375rem)"
  sm: "clamp(0.5rem, 0.4rem + 0.2vw, 0.75rem)"
  md: "clamp(1rem, 0.8rem + 0.4vw, 1.5rem)"
  lg: "clamp(1.5rem, 1.2rem + 0.6vw, 2.25rem)"
  xl: "clamp(2rem, 1.5rem + 1vw, 3.5rem)"
  2xl: "clamp(3rem, 2rem + 2vw, 6rem)"
  3xl: "clamp(4rem, 2.5rem + 3vw, 8rem)"
  section-y: "clamp(3.5rem, 2.5rem + 2vw, 8rem)"
  section-x: "clamp(1.5rem, 1rem + 1.5vw, 4rem)"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.primary-foreground}"
    rounded: "26px"
    padding: "22px 52px"
    fontWeight: "700"
    letterSpacing: "1.6px"
    textTransform: "uppercase"
  button-secondary:
    backgroundColor: "transparent"
    textColor: "{colors.primary}"
    border: "1.2px solid {colors.overlay-navy-60}"
    rounded: "24px"
    padding: "20px 48px"
    fontWeight: "700"
    letterSpacing: "1.5px"
    textTransform: "uppercase"
  button-action:
    backgroundColor: "{colors.secondary}"
    textColor: "{colors.secondary-foreground}"
    rounded: "{rounded.sm}"
    padding: "10.5px 16px"
    fontWeight: "900"
    letterSpacing: "1px"
    textTransform: "uppercase"
  tutor-card:
    backgroundColor: "{colors.surface}"
    rounded: "24px"
    border: "0.3px solid {colors.muted-strong}"
    shadow: "0px 3px 3px rgba(0,0,0,0.1)"
    padding: "21px"
  subject-tag:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.surface-warm}"
    rounded: "7px"
    padding: "4px 12px"
    fontWeight: "800"
    letterSpacing: "0.5px"
  input:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.primary}"
    rounded: "{rounded.sm}"
    border: "1px solid {colors.border-subtle}"
---

## Overview

Tutora là nền tảng kết nối gia sư cao cấp dành cho phụ huynh và học sinh Việt Nam. Visual identity truyền tải **sự tin cậy, học thuật, và ấm áp** — không lạnh lùng như B2B SaaS, không ồn ào như EdTech phổ thông.

Bảng màu xây trên tông **kem–navy–nâu vàng**: nền ấm cream (`#faf9f6`) làm không khí dễ chịu, navy đậm (`#1a2238`) làm điểm neo uy quyền, gold (`#d4b483`) và burgundy (`#631b1b`) nhấn accent sang trọng. Font Bricolage Grotesque tạo cá tính hiện đại nhưng vẫn dễ đọc cho người Việt; IBM Plex Serif dùng cho accent editorial.

Hệ thống spacing và typography đều là **fluid** (`clamp()`), thiết kế cho màn hình từ mobile đến 4K — phản ánh mục tiêu phủ cả web và Zalo Mini App.

---

## Colors

### Primary — Navy `#1a2238`
Màu chủ đạo. Dùng cho heading, button primary, subject tag, text chính. Gợi cảm giác học thuật, tin cậy như đồng phục trường cấp 3. Có 3 mức opacity: 60% (border subtle), 40% (text phụ), 5% (background hover).

### Secondary — Forest Green `#3d4a3e`
CTA quan trọng như "Bắt đầu học" (btn-start-plan, btn-apply). Không cạnh tranh với Primary — chỉ xuất hiện ở action có tính cam kết cao. Hover darkens thêm: `#2f3a2f`.

### Accent — Gold `#d4b483`
Dùng cho trial price badge, premium signal, divider accent. Không bao giờ dùng làm nền lớn — chỉ làm điểm nhấn nhỏ. Text trên gold dùng `#9c7127` (dark gold).

### Destructive — Burgundy `#631b1b`
Error state, cancel, cảnh báo nguy hiểm. Có opacity 60% và 10% cho context nhẹ hơn.

### Background — Warm Cream `#faf9f6`
Nền toàn trang. Ấm hơn pure white, giảm mỏi mắt khi đọc lâu.

### Surface — White `#ffffff` / Warm `#f2f0e4`
White dùng cho card, modal, input. Warm (`#f2f0e4`) dùng cho section đan xen, stat panel, badge nền.

### Status colors
- Success: `#059669` (xác nhận, verified badge, stat tốt)
- Info: `#2563eb` (tutor loại Guided, thông tin trung tính)
- Warning: `#f97316` (tutor loại Elite, rating star, stat cảnh báo)

---

## Typography

**Font chính: Bricolage Grotesque** — grotesque có cá tính, nét chữ variable. Dùng cho toàn bộ UI. Weight 400 (body), 700 (heading, button), 800–900 (badge, stat, label uppercase).

**Font serif: IBM Plex Serif** — dùng accent cho pull quote, testimonial, hoặc marketing headline. Không dùng trong portal/form.

**Typography là fluid** — mọi `font-size` đều dùng `clamp()` scale từ 12px → 80px tương ứng xs → 5xl. Không hardcode `px` cho heading trên màn hình lớn.

**Convention uppercase:** Label nhỏ (stat label, badge type, button) luôn `text-transform: uppercase` + `letter-spacing: 0.8px–1.6px`. Tạo hierarchy rõ ràng mà không cần dùng bold thêm.

**Letter-spacing âm cho heading lớn:** `-0.02em` đến `-0.87px` ở size `2xl` trở lên — tạo cảm giác compact, premium.

---

## Layout & Spacing

Spacing scale là **fluid** (`clamp()`), không dùng fixed `rem` cho section-level spacing. Điều này quan trọng vì app chạy trên cả web 4K lẫn Zalo Mini App 375px.

Container có 8 breakpoint (`sm` → `full`) với `min(maxWidth, vw%)` — responsive mà không cần media query cho container.

Section padding (`--section-padding-y`, `--section-padding-x`) tăng dần từ 56px → 128px (dọc) và 24px → 64px (ngang) theo viewport.

Grid tutor card dùng `flex-wrap` không dùng `grid` cố định — cho phép card 430px tự điều chỉnh khi viewport hẹp.

---

## Shapes

Hệ thống radius **tuân theo bội số ~7**: 3.5 → 7 → 10.5 → 14 → 21 → 28 → 42 → 56 → 9999. Cảm giác nhất quán khi nested (card radius 24 > inner stat panel radius 10.5).

| Khi nào dùng | Radius |
|---|---|
| Micro badge, tag nhỏ | `xs` 3.5px hoặc 7px |
| Button, input, stat panel | `sm` 10.5px |
| Input lớn, chip | `md` 14px |
| Card, modal | `lg` 21px hoặc 24px |
| Hero CTA button | `2xl` 42px hoặc `full` |
| Avatar, dot indicator | `full` 9999px |

Không dùng `rounded-none` (0px) — mọi thứ đều có ít nhất 3.5px. Sharp edge không phù hợp với tone ấm áp của Tutora.

---

## Elevation & Depth

3 mức shadow tương ứng với độ quan trọng:

- **Soft** (`--shadow-soft`): `0px 20px 50px -12px rgba(26,34,56,0.08)` — card hover, button hover. Rất nhẹ, không che mờ nền.
- **Medium** (`--shadow-medium`): `0 20px 25px + 0 8px 10px` — modal, dropdown. Tạo depth thực sự.
- **Inline** (trong component): `0px 3px 3px rgba(0,0,0,0.1)` — tutor card resting state. Tối giản.

Kỹ thuật hover phổ biến: `translateY(-2px)` + shadow tăng — tạo cảm giác "nâng" thay vì chỉ đổi màu.

---

## Components

### Button Primary
Navy nền, trắng chữ, uppercase, letter-spacing rộng, border-radius ~26px (gần pill). Hover nâng lên `translateY(-2px)`. Dùng cho CTA marketing quan trọng nhất trên trang.

### Button Secondary
Viền navy mờ, transparent nền, cùng text navy. Hover fill navy (đảo màu). Dùng cạnh Primary để tạo cặp CTA.

### Button Action (btn-start-plan, btn-apply)
Forest green, radius `sm` (10.5px), uppercase nhỏ, font-weight 900. Dùng trong tutor card và filter — action có tính cam kết cao hơn browse.

### Tutor Card
White nền, radius 24px, border mờ 0.3px. Body padding 21px. Footer tách biệt với `border-top` cream. Subject tag navy-on-cream làm điểm nhấn quan trọng nhất trong card. Stats panel background `rgba(243,244,246,0.5)` — mờ hơn nền card, tạo depth nội tuyến.

### Badge (tutor type)
Màu theo level: Intensive=green, Guided=blue, Elite=orange, Basic=gold gradient. Uppercase, font-weight 900, letter-spacing 0.8px. Không bao giờ dùng màu ngẫu nhiên — các màu này có semantic cố định.

### Subject Tag
Navy nền, cream chữ, radius 7px. Luôn uppercase. Box-shadow nhẹ. Là element identity mạnh nhất của tutor card.

### Trial Price Badge
Gold tint background, gold border, dark gold text. Gradient background nhẹ — không flat. Dùng cho promotion signal.

---

## Do's and Don'ts

- ✅ Dùng `var(--color-*)` thay vì hardcode hex
- ✅ Dùng `clamp()` cho font-size và spacing ở component level lớn
- ✅ Uppercase + letter-spacing cho label, badge, button text
- ✅ Hover state luôn có `transition: 0.2s ease` — không instant
- ✅ Dùng navy opacity thay vì gray cho muted text liên quan đến navy
- ❌ Không dùng rounded-none — mọi element đều có ít nhất 3.5px radius
- ❌ Không dùng pure black (`#000`) — dùng navy `#1a2238` thay thế
- ❌ Không mix serif và grotesque trong cùng một paragraph
- ❌ Không dùng status colors (green/blue/orange) làm brand color — chỉ dùng cho data state
- ❌ Không hardcode font-size px cố định cho heading lớn — phải fluid
