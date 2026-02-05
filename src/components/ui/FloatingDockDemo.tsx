import { FloatingDock } from "@/components/ui/floating-dock";

import anti from "../../assets/anti.svg"
import cursor from "../../assets/cursors.svg"
export function FloatingDockDemo() {
    const links = [
        {
            title: "Claude",
            icon: (
                <img src="https://cdn.jsdelivr.net/gh/homarr-labs/dashboard-icons/svg/claude-ai.svg" alt="Claude" className="h-full w-full text-neutral-500 dark:text-neutral-300" />
            ),
            href: "#",
        },

        {
            title: "OpenCode",
            icon: (
                <img src="https://cdn.jsdelivr.net/gh/homarr-labs/dashboard-icons/svg/opencode-dark.svg" alt="OpenCode" className="h-full w-full text-neutral-500 dark:text-neutral-300" />
            ),
            href: "#",
        },
        {
            title: "Cursor",
            icon: (
                <img src={cursor} width={30} height={30} alt="Cursor" />
            ),
            href: "#",
        },
        {
            title: "Antigravity",
            icon: (
                <img
                    src={anti}
                    width={30}
                    height={30}
                    alt="Antigravity Logo"
                />
            ),
            href: "#",
        },

    ];
    return (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50">
            <FloatingDock
                mobileClassName="translate-y-20"
                items={links}
            />
        </div>
    );
}
