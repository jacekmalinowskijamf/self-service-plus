import SwiftUI

// MARK: - State

enum AppInstallState: Equatable {
    case idle
    case downloading(progress: Double)
    case paused(progress: Double)
    case installed
}

// MARK: - Main Cell

struct AppStoreCell: View {
    let icon: String          // SF Symbol name
    let iconColors: [Color]   // gradient
    let name: String
    let developer: String
    var initialState: AppInstallState = .idle

    @State private var state: AppInstallState = .idle
    @State private var downloadTimer: Timer?

    init(icon: String, iconColors: [Color], name: String, developer: String, initialState: AppInstallState = .idle) {
        self.icon = icon
        self.iconColors = iconColors
        self.name = name
        self.developer = developer
        self.initialState = initialState
        _state = State(initialValue: initialState)
    }

    var body: some View {
        HStack(spacing: 16) {
            AppIcon(symbol: icon, colors: iconColors)

            VStack(alignment: .leading, spacing: 3) {
                Text(name)
                    .font(.system(size: 17, weight: .semibold))
                    .foregroundColor(.primary)
                Text(developer)
                    .font(.system(size: 13))
                    .foregroundColor(.secondary)
            }

            Spacer()

            installControl
        }
        .padding(.horizontal, 20)
        .padding(.vertical, 14)
        .background(Color(nsColor: .controlBackgroundColor))
    }

    // MARK: Install control

    @ViewBuilder
    private var installControl: some View {
        switch state {
        case .idle:
            PillButton(title: "GET") { start(from: 0) }

        case .downloading(let p):
            RingButton(progress: p, icon: "pause.fill") { pause(at: p) }

        case .paused(let p):
            RingButton(progress: p, icon: "arrow.down", dimRing: true) { start(from: p) }

        case .installed:
            PillButton(title: "OPEN") { }
        }
    }

    // MARK: Timer

    private func start(from initial: Double) {
        state = .downloading(progress: initial)
        downloadTimer?.invalidate()
        var p = initial
        downloadTimer = Timer.scheduledTimer(withTimeInterval: 0.04, repeats: true) { t in
            p = min(p + Double.random(in: 0.005...0.012), 1.0)
            if p >= 1.0 {
                t.invalidate()
                withAnimation(.easeOut(duration: 0.2)) { state = .installed }
            } else {
                state = .downloading(progress: p)
            }
        }
    }

    private func pause(at p: Double) {
        downloadTimer?.invalidate()
        state = .paused(progress: p)
    }
}

// MARK: - Sub-views

private struct AppIcon: View {
    let symbol: String
    let colors: [Color]

    var body: some View {
        RoundedRectangle(cornerRadius: 14.4, style: .continuous)
            .fill(LinearGradient(colors: colors, startPoint: .topLeading, endPoint: .bottomTrailing))
            .frame(width: 64, height: 64)
            .overlay(
                Image(systemName: symbol)
                    .font(.system(size: 28, weight: .medium))
                    .foregroundColor(.white)
            )
            .shadow(color: colors.last?.opacity(0.35) ?? .clear, radius: 6, y: 3)
    }
}

private struct PillButton: View {
    let title: String
    let action: () -> Void

    var body: some View {
        Button(action: action) {
            Text(title)
                .font(.system(size: 15, weight: .bold))
                .foregroundColor(.accentColor)
                .padding(.vertical, 7)
                .padding(.horizontal, 16)
                .background(Color.accentColor.opacity(0.12))
                .clipShape(Capsule())
        }
        .buttonStyle(.plain)
    }
}

private struct RingButton: View {
    let progress: Double
    let icon: String
    var dimRing: Bool = false
    let action: () -> Void

    var body: some View {
        Button(action: action) {
            ZStack {
                // Track
                Circle()
                    .stroke(Color.secondary.opacity(0.2), lineWidth: 2.5)

                // Fill
                Circle()
                    .trim(from: 0, to: progress)
                    .stroke(
                        dimRing ? Color.secondary : Color.accentColor,
                        style: StrokeStyle(lineWidth: 2.5, lineCap: .round)
                    )
                    .rotationEffect(.degrees(-90))
                    .animation(.linear(duration: 0.04), value: progress)

                // Icon
                Image(systemName: icon)
                    .font(.system(size: 11, weight: .semibold))
                    .foregroundColor(dimRing ? .secondary : .accentColor)
            }
            .frame(width: 36, height: 36)
        }
        .buttonStyle(.plain)
    }
}

// MARK: - Preview list (shows all states)

struct ContentView: View {
    private let oktaColors: [Color] = [
        Color(hue: 0.63, saturation: 0.7, brightness: 0.9),
        Color(hue: 0.75, saturation: 0.65, brightness: 0.75)
    ]

    var body: some View {
        VStack(spacing: 0) {
            sectionHeader("Not installed")
            AppStoreCell(
                icon: "lock.shield.fill", iconColors: oktaColors,
                name: "Okta", developer: "Okta, Inc.",
                initialState: .idle
            )

            Divider()
            sectionHeader("Downloading (60%)")
            AppStoreCell(
                icon: "lock.shield.fill", iconColors: oktaColors,
                name: "Okta", developer: "Okta, Inc.",
                initialState: .downloading(progress: 0.6)
            )

            Divider()
            sectionHeader("Paused (40%)")
            AppStoreCell(
                icon: "lock.shield.fill", iconColors: oktaColors,
                name: "Okta", developer: "Okta, Inc.",
                initialState: .paused(progress: 0.4)
            )

            Divider()
            sectionHeader("Installed")
            AppStoreCell(
                icon: "lock.shield.fill", iconColors: oktaColors,
                name: "Okta", developer: "Okta, Inc.",
                initialState: .installed
            )
            Divider()
        }
        .frame(width: 400)
        .background(Color(nsColor: .controlBackgroundColor))
    }

    private func sectionHeader(_ label: String) -> some View {
        Text(label.uppercased())
            .font(.system(size: 11, weight: .semibold))
            .foregroundColor(.secondary)
            .frame(maxWidth: .infinity, alignment: .leading)
            .padding(.horizontal, 20)
            .padding(.top, 14)
            .padding(.bottom, 2)
    }
}

// MARK: - App entry

@main
struct AppStoreCellApp: App {
    var body: some Scene {
        WindowGroup {
            ContentView()
        }
        .windowStyle(.hiddenTitleBar)
        .windowResizability(.contentSize)
    }
}
