import { H3Event } from "h3";
import { links } from "~/shared/link";
function getRequestUrl(event: H3Event) {
    return new URL(event.path, `https://${getRequestHost(event)}`);
}

const bypassedPaths = ["/"];

const intercept = (pathname: string) => {
    return !bypassedPaths.includes(pathname);
};

export default defineEventHandler(async (event) => {
    const url = getRequestUrl(event);

    const intercepted = intercept(url.pathname);

    if (intercepted) {
        const key = url.pathname.split("/").pop() || "";

        const link = links.find((link) => link.id === key);

        if (link) return sendRedirect(event, link.url, 301);
    }
});