import { useState, useCallback } from "react";

interface UseContactModalOptions {
  onSuccess?: (result: any) => void;
  onError?: (error: any) => void;
  onSubmit?: (data: any) => void;
}

export function useContactModal(options: UseContactModalOptions = {}) {
  const [isOpen, setIsOpen] = useState(false);
  const [modalConfig, setModalConfig] = useState({
    title: "Свяжитесь с нами",
    description: "Заполните форму ниже, и мы свяжемся с вами в ближайшее время",
    showPhone: true,
    showTopic: true,
    contactDropdownItems: [
      { label: "Сотрудничество", value: "cooperation" },
      { label: "Вопрос по заказу", value: "order_question" },
      { label: "Вопрос по товару", value: "product_question" },
      { label: "Другое", value: "other" },
    ],
  });

  const openModal = useCallback((config?: Partial<typeof modalConfig>) => {
    if (config) {
      setModalConfig((prev) => ({ ...prev, ...config }));
    }
    setIsOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsOpen(false);
  }, []);

  const handleSuccess = useCallback(
    (result: any) => {
      if (options.onSuccess) {
        options.onSuccess(result);
      }
      // Автоматически закрываем модальное окно при успешной отправке
      setTimeout(() => {
        closeModal();
      }, 2000);
    },
    [options.onSuccess, closeModal],
  );

  const handleError = useCallback(
    (error: any) => {
      if (options.onError) {
        options.onError(error);
      }
    },
    [options.onError],
  );

  const handleSubmit = useCallback(
    (data: any) => {
      if (options.onSubmit) {
        options.onSubmit(data);
      }
    },
    [options.onSubmit],
  );

  return {
    isOpen,
    modalConfig,
    openModal,
    closeModal,
    handleSuccess,
    handleError,
    handleSubmit,
  };
}
