import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

// Типы для данных заказа
interface OrderData {
  name: string;
  phone: string;
  email: string;
  address: string;
  delivery: string;
  payment: string;
  cartItems?: any[];
  totalAmount?: number;
}

// Создаем транспортер для Gmail
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER, // Ваш Gmail адрес
    pass: process.env.GMAIL_APP_PASSWORD, // Пароль приложения Gmail
  },
});

export async function POST(request: NextRequest) {
  try {
    const body: OrderData = await request.json();
    
    // Валидация данных
    if (!body.name || !body.phone || !body.email) {
      return NextResponse.json(
        { error: 'Не все обязательные поля заполнены' },
        { status: 400 }
      );
    }

    // Формируем HTML письмо
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333; border-bottom: 2px solid #007bff; padding-bottom: 10px;">
          Новый заказ с сайта
        </h2>
        
        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #007bff; margin-top: 0;">Данные клиента:</h3>
          <p><strong>Имя:</strong> ${body.name}</p>
          <p><strong>Телефон:</strong> ${body.phone}</p>
          <p><strong>Email:</strong> ${body.email}</p>
          <p><strong>Способ доставки:</strong> ${body.delivery === 'courier' ? 'Курьер' : 'Самовывоз'}</p>
          ${body.delivery === 'courier' ? `<p><strong>Адрес:</strong> ${body.address}</p>` : ''}
          <p><strong>Способ оплаты:</strong> ${
            body.payment === 'cash' ? 'Наличными при получении' :
            body.payment === 'card' ? 'Картой при получении' :
            body.payment === 'credit' ? 'Кредит' :
            body.payment === 'installment' ? 'Рассрочка' : body.payment
          }</p>
        </div>

        ${body.cartItems && body.cartItems.length > 0 ? `
        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #007bff; margin-top: 0;">Товары в заказе:</h3>
          ${body.cartItems.map(item => `
            <div style="border-bottom: 1px solid #dee2e6; padding: 10px 0;">
              <p><strong>${item.name}</strong></p>
              <p>Количество: ${item.quantity}</p>
              <p>Цена: ${item.price} руб.</p>
            </div>
          `).join('')}
          ${body.totalAmount ? `<p style="font-weight: bold; font-size: 18px; margin-top: 15px;">Общая сумма: ${body.totalAmount} руб.</p>` : ''}
        </div>
        ` : ''}

        <div style="background: #e7f3ff; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <p style="margin: 0; color: #0056b3;">
            <strong>Время заказа:</strong> ${new Date().toLocaleString('ru-RU')}
          </p>
        </div>
      </div>
    `;

    // Настройки письма
    const mailOptions = {
      from: process.env.GMAIL_USER,
      to: process.env.GMAIL_USER, // Отправляем на ваш же Gmail
      subject: `Новый заказ от ${body.name} - ${body.phone}`,
      html: htmlContent,
      text: `
        Новый заказ с сайта
        
        Данные клиента:
        Имя: ${body.name}
        Телефон: ${body.phone}
        Email: ${body.email}
        Способ доставки: ${body.delivery === 'courier' ? 'Курьер' : 'Самовывоз'}
        ${body.delivery === 'courier' ? `Адрес: ${body.address}` : ''}
        Способ оплаты: ${
          body.payment === 'cash' ? 'Наличными при получении' :
          body.payment === 'card' ? 'Картой при получении' :
          body.payment === 'credit' ? 'Кредит' :
          body.payment === 'installment' ? 'Рассрочка' : body.payment
        }
        
        Время заказа: ${new Date().toLocaleString('ru-RU')}
      `,
    };

    // Отправляем письмо
    await transporter.sendMail(mailOptions);

    return NextResponse.json(
      { success: true, message: 'Заказ успешно отправлен' },
      { status: 200 }
    );

  } catch (error) {
    console.error('Ошибка отправки заказа:', error);
    return NextResponse.json(
      { error: 'Ошибка при отправке заказа' },
      { status: 500 }
    );
  }
} 