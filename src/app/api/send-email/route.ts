import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

// Типы для данных
interface OrderData {
  type: "order";
  name: string;
  phone: string;
  email: string;
  address: string;
  delivery: string;
  payment: string;
  cartItems?: any[];
  totalAmount?: number;
}

interface ContactData {
  type: "contact";
  name: string;
  phone: string;
  message: string;
}

interface ContactFormData {
  type: "contact_form";
  name: string;
  email: string;
  topic: string;
  message: string;
}

type EmailData = OrderData | ContactData | ContactFormData;

// Создаем транспортер для Gmail
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

export async function POST(request: NextRequest) {
  try {
    const body: EmailData = await request.json();

    // Валидация данных
    if (!body.name) {
      return NextResponse.json(
        { error: "Имя обязательно для заполнения" },
        { status: 400 },
      );
    }

    let htmlContent = "";
    let subject = "";
    let textContent = "";

    if (body.type === "order") {
      const orderData = body as OrderData;

      if (!orderData.email) {
        return NextResponse.json(
          { error: "Email обязателен для заказа" },
          { status: 400 },
        );
      }

      subject = `Новый заказ от ${orderData.name} - ${orderData.phone}`;

      htmlContent = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333; border-bottom: 2px solid #007bff; padding-bottom: 10px;">
            Новый заказ с сайта
          </h2>
          
          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #007bff; margin-top: 0;">Данные клиента:</h3>
            <p><strong>Имя:</strong> ${orderData.name}</p>
            <p><strong>Телефон:</strong> ${orderData.phone}</p>
            <p><strong>Email:</strong> ${orderData.email}</p>
            <p><strong>Способ доставки:</strong> ${orderData.delivery === "courier" ? "Курьер" : "Самовывоз"}</p>
            ${orderData.delivery === "courier" ? `<p><strong>Адрес:</strong> ${orderData.address}</p>` : ""}
            <p><strong>Способ оплаты:</strong> ${
              orderData.payment === "cash"
                ? "Наличными при получении"
                : orderData.payment === "card"
                  ? "Картой при получении"
                  : orderData.payment === "credit"
                    ? "Кредит"
                    : orderData.payment === "installment"
                      ? "Рассрочка"
                      : orderData.payment
            }</p>
          </div>

          ${
            orderData.cartItems && orderData.cartItems.length > 0
              ? `
          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #007bff; margin-top: 0;">Товары в заказе:</h3>
            ${orderData.cartItems
              .map(
                (item) => `
              <div style="border-bottom: 1px solid #dee2e6; padding: 10px 0;">
                <p><strong>${item.name}</strong></p>
                <p>Количество: ${item.quantity}</p>
                <p>Цена: ${item.price} руб.</p>
              </div>
            `,
              )
              .join("")}
            ${orderData.totalAmount ? `<p style="font-weight: bold; font-size: 18px; margin-top: 15px;">Общая сумма: ${orderData.totalAmount} руб.</p>` : ""}
          </div>
          `
              : ""
          }

          <div style="background: #e7f3ff; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0; color: #0056b3;">
              <strong>Время заказа:</strong> ${new Date().toLocaleString("ru-RU")}
            </p>
          </div>
        </div>
      `;

      textContent = `
        Новый заказ с сайта
        
        Данные клиента:
        Имя: ${orderData.name}
        Телефон: ${orderData.phone}
        Email: ${orderData.email}
        Способ доставки: ${orderData.delivery === "courier" ? "Курьер" : "Самовывоз"}
        ${orderData.delivery === "courier" ? `Адрес: ${orderData.address}` : ""}
        Способ оплаты: ${
          orderData.payment === "cash"
            ? "Наличными при получении"
            : orderData.payment === "card"
              ? "Картой при получении"
              : orderData.payment === "credit"
                ? "Кредит"
                : orderData.payment === "installment"
                  ? "Рассрочка"
                  : orderData.payment
        }
        
        Время заказа: ${new Date().toLocaleString("ru-RU")}
      `;
    } else if (body.type === "contact") {
      const contactData = body as ContactData;

      if (!contactData.message) {
        return NextResponse.json(
          { error: "Сообщение обязательно для заполнения" },
          { status: 400 },
        );
      }

      subject = `Обратная связь от ${contactData.name} - ${contactData.phone}`;

      htmlContent = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333; border-bottom: 2px solid #28a745; padding-bottom: 10px;">
            Обратная связь с сайта
          </h2>
          
          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #28a745; margin-top: 0;">Данные клиента:</h3>
            <p><strong>Имя:</strong> ${contactData.name}</p>
            <p><strong>Телефон:</strong> ${contactData.phone}</p>
          </div>

          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #28a745; margin-top: 0;">Сообщение:</h3>
            <p style="white-space: pre-wrap; line-height: 1.6;">${contactData.message}</p>
          </div>

          <div style="background: #e7f3ff; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0; color: #0056b3;">
              <strong>Время отправки:</strong> ${new Date().toLocaleString("ru-RU")}
            </p>
          </div>
        </div>
      `;

      textContent = `
        Обратная связь с сайта
        
        Данные клиента:
        Имя: ${contactData.name}
        Телефон: ${contactData.phone}
        
        Сообщение:
        ${contactData.message}
        
        Время отправки: ${new Date().toLocaleString("ru-RU")}
      `;
    } else if (body.type === "contact_form") {
      const contactFormData = body as ContactFormData;

      if (!contactFormData.email || !contactFormData.message) {
        return NextResponse.json(
          { error: "Email и сообщение обязательны для заполнения" },
          { status: 400 },
        );
      }

      subject = `Форма обратной связи от ${contactFormData.name} - ${contactFormData.email}`;

      htmlContent = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333; border-bottom: 2px solid #28a745; padding-bottom: 10px;">
            Форма обратной связи с сайта
          </h2>
          
          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #28a745; margin-top: 0;">Данные клиента:</h3>
            <p><strong>Имя:</strong> ${contactFormData.name}</p>
            <p><strong>Email:</strong> ${contactFormData.email}</p>
            <p><strong>Тема обращения:</strong> ${contactFormData.topic}</p>
          </div>

          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #28a745; margin-top: 0;">Сообщение:</h3>
            <p style="white-space: pre-wrap; line-height: 1.6;">${contactFormData.message}</p>
          </div>

          <div style="background: #e7f3ff; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0; color: #0056b3;">
              <strong>Время отправки:</strong> ${new Date().toLocaleString("ru-RU")}
            </p>
          </div>
        </div>
      `;

      textContent = `
        Форма обратной связи с сайта
        
        Данные клиента:
        Имя: ${contactFormData.name}
        Email: ${contactFormData.email}
        Тема обращения: ${contactFormData.topic}
        
        Сообщение:
        ${contactFormData.message}
        
        Время отправки: ${new Date().toLocaleString("ru-RU")}
      `;
    }

    // Настройки письма
    const mailOptions = {
      from: process.env.GMAIL_USER,
      to: process.env.GMAIL_USER,
      subject: subject,
      html: htmlContent,
      text: textContent,
    };

    // Отправляем письмо
    await transporter.sendMail(mailOptions);

    return NextResponse.json(
      {
        success: true,
        message:
          body.type === "order"
            ? "Заказ успешно отправлен"
            : body.type === "contact_form"
              ? "Сообщение успешно отправлено"
              : "Сообщение успешно отправлено",
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Ошибка отправки:", error);
    return NextResponse.json({ error: "Ошибка при отправке" }, { status: 500 });
  }
}
