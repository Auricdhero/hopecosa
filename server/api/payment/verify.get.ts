export default defineEventHandler(async (event) => {
  const { reference } = getQuery(event);

  if (!reference || typeof reference !== "string") {
    throw createError({
      statusCode: 400,
      message: "Payment reference is required",
    });
  }

  const config = useRuntimeConfig();

  if (!config.paystackSecretKey) {
    throw createError({
      statusCode: 500,
      message: "Payment configuration error",
    });
  }

  const response = await $fetch<{
    status: boolean;
    data: { status: string; amount: number; reference: string };
  }>(
    `https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`,
    {
      headers: {
        Authorization: `Bearer ${config.paystackSecretKey}`,
      },
    },
  );

  if (!response.status) {
    throw createError({
      statusCode: 400,
      message: "Payment verification failed",
    });
  }

  return response;
});
