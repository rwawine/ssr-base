import React, { useState, forwardRef, useImperativeHandle } from "react";
import { useCart } from "@/hooks/CartContext";
import styles from "./page.module.css";

interface CheckoutFormProps {
  onOrderSuccess?: () => void;
  onValidationError?: () => void;
}

const CheckoutForm = forwardRef<HTMLFormElement, CheckoutFormProps>(
  (props, ref) => {
    const { items, fabricItems, totalPrice, clearCart } = useCart();
    const [form, setForm] = useState({
      name: "",
      phone: "",
      email: "",
      address: "",
      delivery: "courier",
      payment: "cash",
    });
    const [errors, setErrors] = useState<any>({});
    const [loading, setLoading] = useState(false);
    const [submitStatus, setSubmitStatus] = useState<{
      type: "success" | "error" | null;
      message: string;
    }>({ type: null, message: "" });

    // Сохраняем ссылку на форму
    const formElement = React.useRef<HTMLFormElement>(null);

    // Экспортируем submitForm наружу
    useImperativeHandle(ref, () => {
      const form = formElement.current as HTMLFormElement & {
        submitForm?: () => void;
      };
      if (form) {
        form.submitForm = () => {
          const event = new Event("submit", {
            cancelable: true,
            bubbles: true,
          });
          form.dispatchEvent(event);
        };
      }
      return form!;
    }, []);

    const validate = () => {
      const errs: any = {};
      if (!/^375\d{9}$/.test(form.phone.replace(/\D/g, "")))
        errs.phone = "Введите корректный телефон";
      if (!form.name.trim()) errs.name = "Введите имя";
      if (!/^\S+@\S+\.\S+$/.test(form.email))
        errs.email = "Введите корректный email";
      if (form.delivery === "courier" && !form.address.trim())
        errs.address = "Введите адрес";
      return errs;
    };

    const handleChange = (
      e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    ) => {
      setForm({ ...form, [e.target.name]: e.target.value });

      // Сбрасываем статус отправки при изменении формы
      if (submitStatus.type) {
        setSubmitStatus({ type: null, message: "" });
      }
    };

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      const errs = validate();
      setErrors(errs);
      if (Object.keys(errs).length > 0) {
        // Если есть ошибки валидации, уведомляем основной компонент
        if (props.onValidationError) {
          props.onValidationError();
        }
        return;
      }

      // Если валидация прошла успешно, устанавливаем состояние загрузки
      setLoading(true);
      setSubmitStatus({ type: null, message: "" });

      try {
        // Подготавливаем данные для отправки
        const orderData = {
          type: "order" as const,
          ...form,
          cartItems: [
            ...items.map((item: any) => ({
              name: item.product.name,
              quantity: item.quantity,
              price:
                item.selectedDimension?.price ||
                item.product.price?.current ||
                0,
            })),
            ...fabricItems.map((item: any) => ({
              name: `${item.fabric.collection.name} - ${item.fabric.variant.name}`,
              quantity: item.quantity,
              price: 0, // Ткани бесплатные
            })),
          ],
          totalAmount: totalPrice,
        };

        // Отправляем данные на API
        const response = await fetch("/api/send-email", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(orderData),
        });

        const result = await response.json();

        if (response.ok && result.success) {
          setSubmitStatus({
            type: "success",
            message:
              "Заказ успешно отправлен! Мы свяжемся с вами в ближайшее время.",
          });

          // Очищаем корзину после успешной отправки
          clearCart();

          // Вызываем callback для уведомления основного компонента
          if (props.onOrderSuccess) {
            props.onOrderSuccess();
          }
        } else {
          setSubmitStatus({
            type: "error",
            message:
              result.error ||
              "Произошла ошибка при отправке заказа. Попробуйте еще раз.",
          });
        }
      } catch (error) {
        console.error("Ошибка отправки заказа:", error);
        setSubmitStatus({
          type: "error",
          message:
            "Произошла ошибка при отправке заказа. Проверьте подключение к интернету и попробуйте еще раз.",
        });
      } finally {
        setLoading(false);
      }
    };

    return (
      <form
        ref={formElement}
        className={styles.checkoutSection}
        onSubmit={handleSubmit}
        autoComplete="off"
      >
        <h2 className={styles.sectionTitle}>Оформление заказа</h2>

        {submitStatus.type && (
          <div
            className={`${styles.submitStatus} ${styles[submitStatus.type]}`}
          >
            {submitStatus.message}
          </div>
        )}

        <div className={styles.field}>
          <label>Телефон*</label>
          <input
            type="tel"
            name="phone"
            value={form.phone}
            onChange={(e) => {
              let value = e.target.value;
              // Если пользователь удаляет всё, оставляем только '+375'
              if (!value.startsWith("+375")) value = "+375";
              // Оставляем только +375 и 9 цифр
              value =
                "+375" +
                value.replace(/\D/g, "").replace(/^375/, "").slice(0, 9);
              if (value.length < 4) value = "+375";
              setForm({ ...form, phone: value });

              // Сбрасываем статус отправки при изменении формы
              if (submitStatus.type) {
                setSubmitStatus({ type: null, message: "" });
              }
            }}
            placeholder="+375XXXXXXXXX"
            className={styles.input}
            maxLength={13}
            autoComplete="tel"
            pattern="\+375[0-9]{9}"
            disabled={loading}
          />
          {errors.phone && <div className={styles.error}>{errors.phone}</div>}
        </div>
        <div className={styles.field}>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Имя"
            className={styles.input}
            autoComplete="name"
            disabled={loading}
          />
          {errors.name && <div className={styles.error}>{errors.name}</div>}
        </div>
        <div className={styles.field}>
          <input
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Почта"
            className={styles.input}
            autoComplete="email"
            disabled={loading}
          />
          {errors.email && <div className={styles.error}>{errors.email}</div>}
        </div>
        <div className={styles.infoNote}>
          Оставьте почту, чтобы мы могли продублировать на нее состав заказа
        </div>
        <div className={styles.field}>
          <label>Способ доставки</label>
          <div className={styles.deliveryTabs}>
            <button
              type="button"
              className={
                form.delivery === "courier"
                  ? styles.buttonActive
                  : styles.buttonTab
              }
              onClick={() => {
                setForm((f) => ({ ...f, delivery: "courier" }));
                if (submitStatus.type) {
                  setSubmitStatus({ type: null, message: "" });
                }
              }}
              disabled={loading}
            >
              Курьер
            </button>
            <button
              type="button"
              className={
                form.delivery === "pickup"
                  ? styles.buttonActive
                  : styles.buttonTab
              }
              onClick={() => {
                setForm((f) => ({ ...f, delivery: "pickup" }));
                if (submitStatus.type) {
                  setSubmitStatus({ type: null, message: "" });
                }
              }}
              disabled={loading}
            >
              Самовывоз
            </button>
          </div>
        </div>
        {form.delivery === "courier" && (
          <div className={styles.field}>
            <input
              name="address"
              value={form.address}
              onChange={handleChange}
              placeholder="Адрес*"
              className={styles.input}
              autoComplete="address"
              disabled={loading}
            />
            {errors.address && (
              <div className={styles.error}>{errors.address}</div>
            )}
          </div>
        )}
        <div className={styles.deliveryDescription}>
          {form.delivery === "courier"
            ? "Курьер доставляет вам товар, а вы тщательно осматриваете заказ, после чего производите оплату. Курьер предоставит вам товарный и кассовый чек. Доставка за пределы Минска осуществляется транспортными компаниями, подробные условия уточняйте у наших менеджеров."
            : "Вы можете самостоятельно забрать заказ из нашего пункта самовывоза. Адрес и время работы уточняйте у менеджера."}
        </div>
        <div className={styles.field}>
          <label>Способ оплаты</label>
          <select
            name="payment"
            value={form.payment}
            onChange={handleChange}
            className={styles.select}
            disabled={loading}
          >
            <option value="cash">Наличными при получении</option>
            <option value="card">Картой при получении</option>
            <option value="credit">Кредит</option>
            <option value="installment">Рассрочка</option>
          </select>
        </div>
      </form>
    );
  },
);

export default CheckoutForm;
