export default {
  /**
   * @param {Request} request
   * @param {{ ASSETS: { fetch: (req: Request) => Promise<Response> }; API_URL?: string }} env
   */
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === "/runtime-config.json") {
      const apiUrl = (env.API_URL ?? "").trim().replace(/\/$/, "");
      return Response.json(
        { apiUrl },
        {
          headers: {
            "Cache-Control": "no-store",
          },
        },
      );
    }

    return env.ASSETS.fetch(request);
  },
};
