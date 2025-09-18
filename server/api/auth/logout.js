export default defineEventHandler(async (event) => {

  try {
    await clearSession(event);
  } catch (error) {
    // return createError({
    //   statusCode: 500,
    //   statusMessage: "Failed to process logout request",
    // });
  }

  return { success: true }
})