
import * as React from "react"
import gsap from "gsap"
import { cva } from "class-variance-authority"
import { NavigationMenu as NavigationMenuPrimitive } from "radix-ui"
import { ChevronDownIcon } from "lucide-react"

import { cn } from "../../lib/utils"

function NavigationMenu({
  className,
  children,
  viewport = true,
  stopColor1 = "red",
  stopColor2 = "violet",
  lastActiveItem = "",
  routeAboutToChange = false,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Root> & {
  viewport?: boolean
  stopColor1?: string
  stopColor2?: string
  lastActiveItem?: string,
  routeAboutToChange?: boolean
}) {

  const navRef = React.useRef<React.ComponentRef<typeof NavigationMenuPrimitive.Root>>(null)
  const contentRef = React.useRef<HTMLDivElement>(null);
  const svgRef = React.useRef<SVGSVGElement>(null)
  const activeItemRef = React.useRef<HTMLElement | null>(null)
  const tlRef = React.useRef<gsap.core.Timeline | null>(null)
  const loadingRef = React.useRef<HTMLDivElement>(null)
  const queueRef = React.useRef(Promise.resolve())
  const isFirstRender = React.useRef(true)

  React.useEffect(() => {
    const svg = svgRef.current
    const navWrapper = navRef.current
    if (!svg || !navWrapper) return

    const xTo = gsap.quickTo(svg, "x", { duration: 0.3, ease: "power2.out" })

    const moveSvgElement = (target: HTMLElement) => {
      activeItemRef.current = target
      const { left, width } = target.getBoundingClientRect()
      xTo(((left - navWrapper.getBoundingClientRect().left) + width / 2) - 80)
    }

    const handleInteraction = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      const item = target.closest('[data-slot="navigation-menu-item"]') as HTMLElement
      if (item) {
        moveSvgElement(item)
      }
    }

    const items = navWrapper.querySelectorAll('[data-slot="navigation-menu-item"]') as NodeListOf<HTMLElement>
    items.forEach((item) => {
      item.addEventListener("mouseenter", handleInteraction)
      item.addEventListener("click", handleInteraction)
    })

    // When the page loads, the svg must be at the position of the last active item
    if (lastActiveItem) {
      const item = navWrapper.querySelector(`[data-slot="navigation-menu-item"][data-link-href="${lastActiveItem}"]`) as HTMLElement
      if (item) {
        moveSvgElement(item)
      }
    }
    // else the svg must be at the position of the first item 
    else {
      const firstItem = navWrapper.querySelector('[data-slot="navigation-menu-item"]') as HTMLElement
      if (firstItem) {
        moveSvgElement(firstItem)
      }
    }

    const observer = new ResizeObserver(() => {
      if (activeItemRef.current) {
        moveSvgElement(activeItemRef.current)

        const rect = activeItemRef.current.getBoundingClientRect()
        const navbarLeft = navWrapper.getBoundingClientRect().left

        // Also update the viewport offset during resize
        navWrapper.style.setProperty('--custom-viewport-offset', `${rect.left - navbarLeft}px`)
      }
    })
    observer.observe(navWrapper)

    return () => {
      items.forEach((item) => {
        item.removeEventListener("mouseenter", handleInteraction)
        item.removeEventListener("click", handleInteraction)
      })
      observer.disconnect()
    }
  }, [])

  React.useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }

    queueRef.current = queueRef.current.then(async () => {
      if (!tlRef.current) return

      if (routeAboutToChange) {
        console.log("queue: transitioning to loading circle")
        // Ensure timeline is paused before tweening playhead
        tlRef.current.pause()
        await tlRef.current.tweenTo("circle", {
          duration: 0.6,
          ease: "expo.inOut"
        })
        await gsap.to(loadingRef.current, { opacity: 1, duration: 0.3 })
      } else {
        console.log("queue: returning to full nav")
        await gsap.to(loadingRef.current, { opacity: 0, duration: 0.2 })
        tlRef.current.play()
        // Wait for the timeline to finish reaching the end
        await tlRef.current
      }
    })
  }, [routeAboutToChange])

  React.useLayoutEffect(() => {
    const mm = gsap.matchMedia()

    mm.add({
      isMobile: "(max-width: 767px)",
      isTablet: "(min-width: 768px) and (max-width: 1023px)",
      isDesktop: "(min-width: 1024px)"
    }, (context) => {
      const { isMobile, isTablet } = context.conditions as any
      const targetWidth = isMobile ? "90%" : isTablet ? "50%" : "60%"

      const tl = gsap.timeline()
      tlRef.current = tl

      // Apple-style Dynamic Island animation when the component is mounted
      tlRef.current.set(navRef.current, {
        width: '60px',
        height: '60px',
        opacity: 0,
        scale: 0.5
      })
        .to(navRef.current, {
          opacity: 1,
          scale: 1,
          duration: 1,
          ease: "back.out(1.7)"
        })
        .addLabel("circle")
        .to(navRef.current, {
          width: targetWidth,
          duration: 0.6,
          ease: "expo.out"
        })
        .to(contentRef.current, {
          opacity: 1,
          duration: 0.3
        }, "-=0.2")
        .addLabel("full")

      return () => tl.kill()
    }, navRef)

    return () => {
      console.log("NavigationMenu unmounted")
      mm.revert()
    }
  }, [])


  return (
    <NavigationMenuPrimitive.Root
      ref={navRef}
      data-slot="navigation-menu"
      data-viewport={viewport}
      className={cn(
        "weird-nav group/navigation-menu fixed mx-auto inset-x-0 z-50 top-4 flex flex-1 items-center justify-center ring-1 ring-white/10 dark:ring-black/10 bg-black dark:bg-white rounded-full py-3 px-5 text-white dark:text-black opacity-0",
        className
      )}
      {...props}
    >
      <div ref={contentRef} className="w-[92%] sm:w-[85%] md:w-[80%] lg:w-5xl xl:w-7xl opacity-0">
        <span
          className={`pointer-events-none absolute inset-0 z-0 overflow-hidden rounded-full blur-lg opacity-65`}
        >
          <svg
            ref={svgRef}
            viewBox="0 0 60 120"
            height="60"
            width="120"
            style={{ transform: "translateX(-35px)" }}
          >
            <defs>
              <linearGradient id="active-link-svg" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor={stopColor1} />
                <stop offset="100%" stopColor={stopColor2} />
              </linearGradient>
            </defs>
            <rect fill={`url(#active-link-svg)`} x="0" y="30" width="150" height="60" />
          </svg>
        </span>
        {children}
      </div>
      <div ref={loadingRef} className="absolute inset-0 flex items-center justify-center opacity-0 pointer-events-none">
        <div className="flex gap-1.5">
        </div>
      </div>
      {viewport && <NavigationMenuViewport />}
    </NavigationMenuPrimitive.Root>
  )
}

function NavigationMenuList({
  className,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.List>) {
  return (
    <NavigationMenuPrimitive.List
      data-slot="navigation-menu-list"
      className={cn(
        "group flex flex-1 list-none items-center justify-between gap-0",
        className
      )}
      {...props}
    />
  )
}

function NavigationMenuItem({
  className,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Item>) {
  return (
    <NavigationMenuPrimitive.Item
      data-slot="navigation-menu-item"
      className={cn("relative", className)}
      {...props}
    />
  )
}

const navigationMenuTriggerStyle = cva(
  "group/navigation-menu-trigger inline-flex h-9 w-max items-center justify-center rounded-lg px-2.5 py-1.5 text-sm font-medium transition-all outline-none disabled:pointer-events-none disabled:opacity-50"
)

function NavigationMenuTrigger({
  className,
  children,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Trigger>) {
  return (
    <NavigationMenuPrimitive.Trigger
      data-slot="navigation-menu-trigger"
      className={cn(navigationMenuTriggerStyle(), "group", className)}
      {...props}
    >
      {children}{" "}
      <ChevronDownIcon className="relative top-px ml-1 size-3 transition duration-300 group-data-[state=open]/navigation-menu-trigger:rotate-180" aria-hidden="true" />
    </NavigationMenuPrimitive.Trigger>
  )
}

function NavigationMenuContent({
  className,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Content>) {
  return (
    <NavigationMenuPrimitive.Content
      data-slot="navigation-menu-content"
      className={cn(
        "top-0 left-0 w-full p-1 [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] group-data-[viewport=false]/navigation-menu:top-full group-data-[viewport=false]/navigation-menu:mt-1.5 group-data-[viewport=false]/navigation-menu:overflow-hidden group-data-[viewport=false]/navigation-menu:rounded-lg group-data-[viewport=false]/navigation-menu:bg-popover group-data-[viewport=false]/navigation-menu:text-popover-foreground group-data-[viewport=false]/navigation-menu:shadow group-data-[viewport=false]/navigation-menu:ring-1 group-data-[viewport=false]/navigation-menu:ring-foreground/10 group-data-[viewport=false]/navigation-menu:duration-300 data-[motion=from-end]:slide-in-from-right-52 data-[motion=from-start]:slide-in-from-left-52 data-[motion=to-end]:slide-out-to-right-52 data-[motion=to-start]:slide-out-to-left-52 data-[motion^=from-]:animate-in data-[motion^=from-]:fade-in data-[motion^=to-]:animate-out data-[motion^=to-]:fade-out md:absolute md:w-auto group-data-[viewport=false]/navigation-menu:data-[state=open]:animate-in group-data-[viewport=false]/navigation-menu:data-[state=open]:fade-in-0 group-data-[viewport=false]/navigation-menu:data-[state=open]:zoom-in-95 group-data-[viewport=false]/navigation-menu:data-[state=closed]:animate-out group-data-[viewport=false]/navigation-menu:data-[state=closed]:fade-out-0 group-data-[viewport=false]/navigation-menu:data-[state=closed]:zoom-out-95",
        className
      )}
      {...props}
    />
  )
}

function NavigationMenuViewport({
  className,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Viewport>) {
  return (
    <div
      className={cn(
        "absolute top-full isolate z-50 flex w-full"
      )}
    >
      <NavigationMenuPrimitive.Viewport
        data-slot="navigation-menu-viewport"
        className={cn(
          "origin-top-center relative mt-1.5 h-[var(--radix-navigation-menu-viewport-height)] w-full overflow-hidden rounded-xl bg-popover text-popover-foreground shadow ring-1 ring-foreground/10 duration-100 data-[state=open]:animate-in data-[state=open]:zoom-in-90 data-[state=closed]:animate-out data-[state=closed]:zoom-out-90 dark:bg-foreground",
          className
        )}
        {...props}
      />
    </div>
  )
}

function NavigationMenuLink({
  className,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Link>) {
  return (
    <NavigationMenuPrimitive.Link
      data-slot="navigation-menu-link"
      className={cn(
        "flex items-center gap-2 rounded-lg p-2 text-sm transition-all outline-none hover:bg-muted data-[active]:bg-muted/50 data-[active]:hover:bg-muted data-[active]:focus:bg-muted [&_svg:not([class*='size-'])]:size-4 dark:text-background dark:hover:text-foreground",
        className
      )}
      {...props}
    />
  )
}

function NavigationMenuIndicator({
  className,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Indicator>) {
  return (
    <NavigationMenuPrimitive.Indicator
      data-slot="navigation-menu-indicator"
      className={cn(
        "top-full z-[1] flex h-1.5 items-end justify-center overflow-hidden data-[state=hidden]:animate-out data-[state=hidden]:fade-out data-[state=visible]:animate-in data-[state=visible]:fade-in",
        className
      )}
      {...props}
    >
      <div className="relative top-[60%] h-2 w-2 rotate-45 rounded-tl-sm bg-border shadow-md" />
    </NavigationMenuPrimitive.Indicator>
  )
}

function NavigationMenuListItem({
  title,
  children,
  href,
  ...props
}: React.ComponentPropsWithoutRef<"li"> & { href: string }) {
  return (
    <li {...props}>
      <NavigationMenuLink asChild>
        <a href={href}>
          <div className="flex flex-col gap-1 text-sm">
            <div className="leading-none font-medium">{title}</div>
            <div className="line-clamp-2 text-">{children}</div>
          </div>
        </a>
      </NavigationMenuLink>
    </li>
  )
}

export {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuContent,
  NavigationMenuTrigger,
  NavigationMenuLink,
  NavigationMenuIndicator,
  NavigationMenuViewport,
  NavigationMenuListItem,
  navigationMenuTriggerStyle,
}

// Add keyframes for the pulse animation
if (typeof document !== 'undefined') {
  const style = document.createElement('style')
  style.textContent = `
    @keyframes pulse {
      0%, 100% { opacity: 0.3; transform: scale(0.8); }
      50% { opacity: 1; transform: scale(1.2); }
    }
  `
  document.head.appendChild(style)
}
