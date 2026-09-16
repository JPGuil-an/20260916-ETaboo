import React, { createContext, forwardRef, useContext, useMemo, useState } from "react";

const cx = (...classes) => classes.filter(Boolean).join(" ");

const colorClasses = {
  default: "bg-shop-600 text-white hover:bg-shop-700 focus:ring-shop-200",
  success: "bg-shop-600 text-white hover:bg-shop-700 focus:ring-shop-200",
  warning: "bg-amber-500 text-white hover:bg-amber-600 focus:ring-amber-200",
  failure: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-200",
  gray: "border border-stone-300 bg-white text-stone-700 hover:bg-stone-50 focus:ring-stone-200",
};

export const Button = forwardRef(function Button(
  { children, className, color = "default", pill, size = "md", ...props },
  ref,
) {
  const sizes = { xs: "px-2.5 py-1.5 text-xs", sm: "px-3 py-2 text-xs", md: "px-4 py-2.5 text-sm", lg: "px-5 py-3 text-base" };
  return (
    <button
      ref={ref}
      className={cx(
        "inline-flex items-center justify-center gap-2 font-semibold shadow-sm transition focus:outline-none focus:ring-4 disabled:cursor-not-allowed disabled:opacity-50",
        pill ? "rounded-full" : "rounded-md",
        sizes[size] || sizes.md,
        colorClasses[color] || colorClasses.default,
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
});

export function Spinner({ className, size = "md", ...props }) {
  const sizes = { sm: "h-4 w-4", md: "h-5 w-5", lg: "h-8 w-8", xl: "h-10 w-10" };
  return <span className={cx("inline-block animate-spin rounded-full border-2 border-current border-r-transparent", sizes[size] || sizes.md, className)} role="status" {...props} />;
}

export function Badge({ children, className, color = "default", size = "sm" }) {
  const colors = {
    default: "bg-shop-100 text-shop-700",
    success: "bg-shop-100 text-shop-700",
    warning: "bg-amber-100 text-amber-800",
    failure: "bg-red-100 text-red-700",
    gray: "bg-stone-100 text-stone-700",
  };
  return <span className={cx("inline-flex items-center rounded-full font-semibold", size === "sm" ? "px-2.5 py-1 text-xs" : "px-3 py-1.5 text-sm", colors[color] || colors.default, className)}>{children}</span>;
}

export function Alert({ children, className, color = "default", icon: Icon, rounded = true }) {
  const colors = color === "success" ? "border-shop-200 bg-shop-50 text-shop-800" : color === "failure" ? "border-red-200 bg-red-50 text-red-800" : "border-stone-200 bg-white text-stone-700";
  return <div className={cx("flex gap-3 border p-4 text-sm", rounded && "rounded-lg", colors, className)} role="alert">{Icon && <Icon className="mt-0.5 h-5 w-5 shrink-0" />}{children}</div>;
}

const inputClass = "block w-full rounded-md border border-stone-300 bg-white px-3 py-2 text-sm text-stone-900 shadow-sm outline-none transition placeholder:text-stone-400 focus:border-shop-500 focus:ring-2 focus:ring-shop-100 disabled:bg-stone-100";

export const TextInput = forwardRef(function TextInput({ className, sizing, ...props }, ref) {
  return <input ref={ref} className={cx(inputClass, sizing === "lg" && "px-4 py-3 text-base", className)} {...props} />;
});

export const Textarea = forwardRef(function Textarea({ className, ...props }, ref) {
  return <textarea ref={ref} className={cx(inputClass, "min-h-[96px] resize-y", className)} {...props} />;
});

export const Label = forwardRef(function Label({ children, className, value, ...props }, ref) {
  return <label ref={ref} className={cx("mb-2 block text-sm font-semibold text-stone-700", className)} {...props}>{value ?? children}</label>;
});

function TableRoot({ children, className, striped, hoverable, ...props }) {
  return <div className="w-full overflow-x-auto rounded-lg border border-stone-200 bg-white"><table className={cx("w-full text-left text-sm text-stone-600", striped && "[&_tbody_tr:nth-child(even)]:bg-stone-50", hoverable && "[&_tbody_tr]:transition [&_tbody_tr:hover]:bg-shop-50", className)} {...props}>{children}</table></div>;
}
const TableHead = ({ children, className, ...props }) => <thead className={cx("bg-shop-50 text-xs uppercase tracking-wide text-shop-800", className)} {...props}>{children}</thead>;
const TableHeadCell = ({ children, className, ...props }) => <th className={cx("whitespace-nowrap px-5 py-3 font-bold", className)} {...props}>{children}</th>;
const TableBody = ({ children, className, ...props }) => <tbody className={cx("divide-y divide-stone-200", className)} {...props}>{children}</tbody>;
const TableRow = ({ children, className, ...props }) => <tr className={cx("bg-white", className)} {...props}>{children}</tr>;
const TableCell = ({ children, className, ...props }) => <td className={cx("px-5 py-4", className)} {...props}>{children}</td>;
export const Table = Object.assign(TableRoot, { Head: TableHead, HeadCell: TableHeadCell, Body: TableBody, Row: TableRow, Cell: TableCell });

export function Pagination({ currentPage = 1, totalPages = 1, onPageChange = () => {}, className, showIcons }) {
  const pages = useMemo(() => {
    const start = Math.max(1, Math.min(currentPage - 2, totalPages - 4));
    return Array.from({ length: Math.min(5, Math.max(0, totalPages)) }, (_, index) => start + index);
  }, [currentPage, totalPages]);
  if (totalPages <= 1) return null;
  return <nav className={cx("flex items-center justify-center gap-1", className)} aria-label="Pagination">
    <button type="button" className="rounded-md border border-stone-200 bg-white px-3 py-2 text-sm text-stone-600 hover:bg-shop-50 disabled:opacity-40" disabled={currentPage <= 1} onClick={() => onPageChange(currentPage - 1)}>{showIcons ? "‹" : "Previous"}</button>
    {pages.map((page) => <button type="button" key={page} onClick={() => onPageChange(page)} className={cx("h-9 min-w-9 rounded-md border px-2 text-sm font-semibold", page === currentPage ? "border-shop-600 bg-shop-600 text-white" : "border-stone-200 bg-white text-stone-600 hover:bg-shop-50")}>{page}</button>)}
    <button type="button" className="rounded-md border border-stone-200 bg-white px-3 py-2 text-sm text-stone-600 hover:bg-shop-50 disabled:opacity-40" disabled={currentPage >= totalPages} onClick={() => onPageChange(currentPage + 1)}>{showIcons ? "›" : "Next"}</button>
  </nav>;
}

function TabsItem({ children }) { return children; }
function TabsGroup({ children, className }) {
  const items = React.Children.toArray(children).filter(Boolean);
  const [activeIndex, setActiveIndex] = useState(0);
  const safeIndex = Math.min(activeIndex, Math.max(0, items.length - 1));
  return <div className={className}>
    <div className="mb-5 flex gap-1 overflow-x-auto border-b border-stone-200" role="tablist">
      {items.map((item, index) => {
        const Icon = item.props.icon;
        return <button key={item.key || index} type="button" role="tab" aria-selected={index === safeIndex} onClick={() => setActiveIndex(index)} className={cx("inline-flex shrink-0 items-center gap-2 border-b-2 px-4 py-3 text-sm font-semibold transition", index === safeIndex ? "border-shop-600 text-shop-700" : "border-transparent text-stone-500 hover:border-shop-200 hover:text-shop-600")}>{Icon && <Icon className="h-4 w-4" />}{item.props.title}</button>;
      })}
    </div>
    <div role="tabpanel">{items[safeIndex]?.props.children}</div>
  </div>;
}
export const Tabs = { Group: TabsGroup, Item: TabsItem };

const ModalContext = createContext(() => {});
function ModalRoot({ children, show, onClose = () => {}, className, size = "md" }) {
  if (!show) return null;
  const widths = { sm: "max-w-sm", md: "max-w-lg", lg: "max-w-2xl", xl: "max-w-4xl", "2xl": "max-w-6xl" };
  return <ModalContext.Provider value={onClose}><div className="fixed inset-0 z-[80] flex items-center justify-center p-4" role="dialog" aria-modal="true"><button type="button" aria-label="Close modal" onClick={onClose} className="absolute inset-0 bg-stone-950/55 backdrop-blur-sm" /><div className={cx("relative max-h-[90vh] w-full overflow-y-auto rounded-xl bg-white shadow-2xl", widths[size] || widths.md, className)}>{children}</div></div></ModalContext.Provider>;
}
function ModalHeader({ children, className }) { const close = useContext(ModalContext); return <div className={cx("flex items-center justify-between border-b border-stone-200 px-6 py-4", className)}><h3 className="text-lg font-bold text-stone-900">{children}</h3><button type="button" onClick={close} className="rounded-full p-2 text-2xl leading-none text-stone-400 hover:bg-stone-100 hover:text-stone-700" aria-label="Close">×</button></div>; }
const ModalBody = ({ children, className }) => <div className={cx("p-6", className)}>{children}</div>;
const ModalFooter = ({ children, className }) => <div className={cx("flex items-center justify-end gap-3 border-t border-stone-200 px-6 py-4", className)}>{children}</div>;
export const Modal = Object.assign(ModalRoot, { Header: ModalHeader, Body: ModalBody, Footer: ModalFooter });

const NavbarContext = createContext({ open: false, setOpen: () => {} });
function NavbarRoot({ children, className }) { const [open, setOpen] = useState(false); return <NavbarContext.Provider value={{ open, setOpen }}><nav className={cx("rounded-lg bg-white px-4 py-3 shadow-sm", className)}>{children}</nav></NavbarContext.Provider>; }
const NavbarBrand = ({ children, className, href, ...props }) => <a href={href} className={cx("inline-flex items-center", className)} {...props}>{children}</a>;
function NavbarToggle({ className }) { const { open, setOpen } = useContext(NavbarContext); return <button type="button" onClick={() => setOpen(!open)} className={cx("rounded-md border border-stone-200 p-2 text-stone-600 md:hidden", className)} aria-label="Toggle navigation">☰</button>; }
function NavbarCollapse({ children, className }) { const { open } = useContext(NavbarContext); return <div className={cx(open ? "flex" : "hidden", "flex-col gap-2 md:flex md:flex-row md:items-center", className)}>{children}</div>; }
const NavbarLink = ({ children, className, active, ...props }) => <a className={cx("rounded-md px-3 py-2 text-sm font-semibold", active ? "bg-shop-50 text-shop-700" : "text-stone-600 hover:bg-shop-50 hover:text-shop-700", className)} {...props}>{children}</a>;
export const Navbar = Object.assign(NavbarRoot, { Brand: NavbarBrand, Toggle: NavbarToggle, Collapse: NavbarCollapse, Link: NavbarLink });

function SidebarRoot({ children, className }) { return <aside className={cx("h-full w-64 bg-white p-4 shadow-sm", className)}>{children}</aside>; }
const SidebarItems = ({ children, className }) => <div className={className}>{children}</div>;
const SidebarItemGroup = ({ children, className }) => <div className={cx("space-y-1 border-b border-stone-200 py-3 last:border-0", className)}>{children}</div>;
function SidebarItem({ children, className, href, icon: Icon, ...props }) { const Component = href ? "a" : "div"; return <Component href={href} className={cx("flex items-center gap-3 rounded-md px-3 py-2 text-sm font-semibold text-stone-600 transition hover:bg-shop-50 hover:text-shop-700", className)} {...props}>{Icon && <Icon className="h-5 w-5" />}{children}</Component>; }
function SidebarCollapse({ children, className, label, icon: Icon }) { const [open, setOpen] = useState(false); return <div className={className}><button type="button" onClick={() => setOpen(!open)} className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-semibold text-stone-600 hover:bg-shop-50 hover:text-shop-700">{Icon && <Icon className="h-5 w-5" />}<span className="flex-1 text-left">{label}</span><span>{open ? "−" : "+"}</span></button>{open && <div className="ml-4 mt-1 space-y-1 border-l border-shop-100 pl-2">{children}</div>}</div>; }
export const Sidebar = Object.assign(SidebarRoot, { Items: SidebarItems, ItemGroup: SidebarItemGroup, Item: SidebarItem, Collapse: SidebarCollapse });
