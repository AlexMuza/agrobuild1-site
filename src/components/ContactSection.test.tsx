import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ContactSection from "@/components/ContactSection";
import { LanguageProvider } from "@/contexts/LanguageContext";

type MockResponse = { ok: boolean; status: number; json?: unknown; text?: string };

function mockFetch(handlers: Record<string, (init?: RequestInit) => MockResponse | Promise<MockResponse>>) {
  const fetchMock = vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
    const url = typeof input === "string" ? input : input instanceof URL ? input.toString() : input.url;
    const handler = handlers[url];
    if (!handler) {
      throw new Error(`No fetch handler for ${url}`);
    }
    const res = await handler(init);
    return {
      ok: res.ok,
      status: res.status,
      json: async () => res.json,
      text: async () => res.text ?? JSON.stringify(res.json ?? {}),
    } as unknown as Response;
  });

  globalThis.fetch = fetchMock as unknown as typeof fetch;
  return fetchMock;
}

function renderForm() {
  return render(
    <LanguageProvider>
      <ContactSection />
    </LanguageProvider>,
  );
}

describe("ContactSection", () => {
  it("shows inline error for invalid phone", async () => {
    mockFetch({
      "/api/captcha": () => ({ ok: true, status: 200, json: { ok: true, a: 1, b: 2, token: "t", ttlMs: 1000 } }),
    });

    const user = userEvent.setup();
    renderForm();

    await user.type(screen.getByPlaceholderText("Ваше имя"), "Иван");
    await user.type(screen.getByPlaceholderText("+7 (999) 999-99-99"), "123");
    await user.click(screen.getByRole("button", { name: /Отправить/i }));

    expect(await screen.findByText(/Введите корректный телефон/i)).toBeInTheDocument();
  });

  it("submits when captcha and fields are valid", async () => {
    const fetchMock = mockFetch({
      "/api/captcha": () => ({ ok: true, status: 200, json: { ok: true, a: 3, b: 4, token: "token", ttlMs: 1000 } }),
      "/api/lead": async (init) => {
        const body = JSON.parse(String(init?.body || "{}"));
        // Basic shape check.
        expect(body.name).toBeTruthy();
        expect(body.phone).toMatch(/^\+7/);
        expect(body.captchaToken).toBe("token");
        expect(body.captchaAnswer).toBe("7");
        return { ok: true, status: 200, json: { ok: true, delivered: ["telegram"], failed: [] } };
      },
    });

    const user = userEvent.setup();
    renderForm();

    await user.type(screen.getByPlaceholderText("Ваше имя"), "Иван Иванов");
    await user.type(screen.getByPlaceholderText("+7 (999) 999-99-99"), "9802488485");
    await user.type(screen.getByPlaceholderText("Комментарий (необязательно)"), "Хочу консультацию");
    await user.type(screen.getByPlaceholderText("Ответ"), "7");

    await user.click(screen.getByRole("button", { name: /Отправить/i }));

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledWith("/api/lead", expect.anything());
    });
  });
});

