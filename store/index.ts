import { create } from "zustand";

type navState = {
    isOpen: boolean;
    open: () => void;
    close: () => void;
    toggle: () => void;
};

export const useMobileNav = create<navState>()(set => ({
    isOpen: false,
    open: ()=> set({isOpen: true}),
    close: ()=> set({isOpen: false}),
    toggle: ()=> set(state => ({isOpen: !state.isOpen}))
}))

export const useDesktopNav = create<navState>()(set => ({
    isOpen: false,
    open: ()=> set({isOpen: true}),
    close: ()=> set({isOpen: false}),
    toggle: ()=> set(state => ({isOpen: !state.isOpen}))
}))