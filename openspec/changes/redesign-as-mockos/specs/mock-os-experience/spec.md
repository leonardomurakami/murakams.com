## Purpose

Provides the immersive old-PC experience, including power-on, boot, presentation-mode selection, desktop applications, window management, responsive behavior, and graceful failure paths.

## ADDED Requirements

### Requirement: Power-on and boot sequence
The immersive experience SHALL begin in a powered-off state on every fresh document load and SHALL begin an authored boot sequence only after the visitor activates the power control on the computer case within the shared repair-bench scene.

#### Scenario: Visitor powers on the site
- **WHEN** a visitor activates the computer-case power control
- **THEN** the case and monitor visibly power on, the view moves into the CRT, and the system plays an original startup sequence before revealing the MockOS desktop

#### Scenario: Client navigation does not reboot
- **WHEN** a visitor navigates between applications without a fresh document load
- **THEN** the running desktop remains mounted and the boot sequence does not replay

#### Scenario: Boot can be skipped
- **WHEN** a visitor activates Skip startup or presses Escape during boot
- **THEN** the desktop becomes available immediately

### Requirement: Original audiovisual identity
The MockOS SHALL use original naming, icons, graphics, startup sound, and other media while drawing interaction inspiration from Windows 95/98-era personal computers. It SHALL NOT use Microsoft trademarks or copied Windows assets.

#### Scenario: Startup sound
- **WHEN** the visitor powers on the immersive experience
- **THEN** any sound played is an original sound initiated from that user gesture

### Requirement: Presentation mode selection
The system SHALL provide immersive and accessible presentation modes, SHALL expose the Accessible Site control before power-on and within the running system, and SHALL persist an explicit visitor choice.

#### Scenario: Visitor selects accessible mode before startup
- **WHEN** the visitor selects Accessible Site from the power screen
- **THEN** the current canonical route reloads as a conventional page without boot, windows, audio, or cinematic workstation interactions

#### Scenario: Reduced motion without stored preference
- **WHEN** no explicit mode is stored and the visitor prefers reduced motion
- **THEN** the system defaults to the accessible presentation

#### Scenario: Visitor returns to immersive mode
- **WHEN** an accessible-site visitor selects Launch MockOS
- **THEN** the preference changes and the current canonical route reloads into the immersive startup

### Requirement: Desktop and application registry
After boot, the system SHALL expose a desktop, original application icons, a launcher, a taskbar, and registered applications for Welcome, Projects, Infrastructure, Resume, Playground, and Contact.

#### Scenario: Desktop launches an application
- **WHEN** a visitor activates a registered desktop icon or launcher item
- **THEN** the corresponding application opens or receives focus

#### Scenario: Taskbar represents open applications
- **WHEN** one or more applications are open
- **THEN** each is represented in the taskbar with its active or minimized state

### Requirement: Full desktop window management
On desktop-sized viewports, application windows SHALL support focus and z-order, movement, edge and corner resizing, minimize, maximize, restore, and close operations while remaining within usable viewport bounds.

#### Scenario: Visitor focuses an obscured window
- **WHEN** the visitor activates part of an obscured window
- **THEN** that window moves to the active z-order position

#### Scenario: Viewport changes
- **WHEN** the viewport becomes smaller than a window's current bounds
- **THEN** the window is resized or repositioned so its controls and content remain reachable

#### Scenario: Keyboard launches an icon
- **WHEN** a focused desktop icon is activated with Enter
- **THEN** its registered application opens or receives focus

### Requirement: Compact mobile workspace
On narrow or touch-first viewports, the MockOS SHALL preserve its visual identity while presenting one maximized application at a time and disabling free window movement and resizing.

#### Scenario: Mobile app launch
- **WHEN** a mobile visitor launches an application
- **THEN** it opens in a touch-operable maximized view with a way to return to the launcher

### Requirement: Canonical route synchronization
The active content application SHALL synchronize with the canonical route, and loading a canonical route in immersive mode SHALL boot before opening the corresponding application.

#### Scenario: Direct route load
- **WHEN** a visitor loads `/resume` as a fresh document in immersive mode
- **THEN** the system boots and opens the Resume application

#### Scenario: Direct project load
- **WHEN** a visitor loads an existing `/projects/[slug]` route in immersive mode
- **THEN** the system boots and opens that project's case-study application without requiring cabinet selection

#### Scenario: Browser history traversal
- **WHEN** the visitor uses browser Back or Forward after switching applications
- **THEN** the application corresponding to the resulting canonical route opens or receives focus

### Requirement: Shared 2D workstation continuity
The power screen, boot sequence, running desktop, Program Disks cabinet, and disk drive SHALL inhabit one persistent 2D repair-bench scene. Spatial transitions SHALL preserve the relationship between the physical computer and the live CRT rather than replacing one unrelated surface with another.

#### Scenario: View enters the computer
- **WHEN** the case powers on
- **THEN** the same repair-bench scene moves from the full computer view into the CRT where boot and desktop content render

#### Scenario: View leaves the screen for removable media
- **WHEN** the visitor opens Program Disks
- **THEN** the live desktop remains mounted while the view pulls back from the CRT to reveal the same computer case, drive, and program-disk cabinet

#### Scenario: Reduced spatial motion
- **WHEN** immersive mode is explicitly selected while reduced motion is requested
- **THEN** the system uses a short non-spatial state transition while preserving the same scene and controls

### Requirement: Immersive failure containment
A failure in an application or media asset SHALL NOT make the desktop unusable and SHALL provide a path to the equivalent canonical content.

#### Scenario: Workstation animation is unavailable
- **WHEN** a workstation transition cannot run
- **THEN** the requested Projects or Program Disks content remains operable without the cinematic movement

#### Scenario: Application fails
- **WHEN** an application cannot render its content
- **THEN** the failure is shown inside an application-level error state and the desktop remains operable
