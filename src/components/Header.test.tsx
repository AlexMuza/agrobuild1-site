import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Header from "@/components/Header";
import { LanguageProvider } from "@/contexts/LanguageContext";

function renderHeader() {
  return render(
    <LanguageProvider>
      <Header />
    </LanguageProvider>,
  );
}

describe("Header language switch", () => {
  it("switches RU -> EN and updates nav labels", async () => {
    const user = userEvent.setup();
    renderHeader();

    expect(screen.getByText("О нас")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "EN" }));
    expect(screen.getByText("About")).toBeInTheDocument();
  });
});

