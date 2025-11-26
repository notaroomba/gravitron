use rand::Rng;
use wasm_bindgen::prelude::*;
use serde::{ Serialize, Deserialize };
use core::ops;
use std::vec;
// extern crate console_error_panic_hook;
// use std::panic;

#[wasm_bindgen]
#[derive(Serialize, Deserialize, Clone, PartialEq, Copy, Default)]
pub struct Vec3 {
    pub x: f64,
    pub y: f64,
    pub z: f64,
}
#[wasm_bindgen]
impl Vec3 {
    #[wasm_bindgen(constructor)]
    pub fn new(x: f64, y: f64, z: f64) -> Self {
        Self { x, y, z }
    }
    pub fn divide(&mut self, n: f64) {
        self.x = self.x / n;
        self.y = self.y / n;
        self.z = self.z / n;
    }
    pub fn distance_from(&self, other: Vec3) -> f64 {
        f64::sqrt(
            f64::powi(self.x - other.x, 2) +
                f64::powi(self.y - other.y, 2) +
                f64::powi(self.z - other.z, 2)
        )
    }
}
impl ops::Add for Vec3 {
    type Output = Vec3;
    fn add(self, rhs: Self) -> Self::Output {
        Vec3 {
            x: self.x + rhs.x,
            y: self.y + rhs.y,
            z: self.z + rhs.z,
        }
    }
}
impl ops::Sub for Vec3 {
    type Output = Vec3;
    fn sub(self, rhs: Self) -> Self::Output {
        Vec3 {
            x: self.x - rhs.x,
            y: self.y - rhs.y,
            z: self.z - rhs.z,
        }
    }
}
impl ops::AddAssign for Vec3 {
    fn add_assign(&mut self, other: Self) {
        *self = Self {
            x: self.x + other.x,
            y: self.y + other.y,
            z: self.z + other.z,
        };
    }
}
impl ops::DivAssign<f64> for Vec3 {
    fn div_assign(&mut self, d: f64) {
        self.x /= d;
        self.y /= d;
        self.z /= d;
    }
}
impl ops::Mul<f64> for Vec3 {
    type Output = Self;
    fn mul(self, m: f64) -> Self {
        Self::new(self.x * m, self.y * m, self.z * m)
    }
}
impl ops::Div<f64> for Vec3 {
    type Output = Self;
    fn div(self, m: f64) -> Self {
        Self::new(self.x / m, self.y / m, self.z / m)
    }
}

// Vec2 for quadtree (2D only)
#[wasm_bindgen]
#[derive(Serialize, Deserialize, Clone, PartialEq, Copy, Default)]
pub struct Vec2 {
    pub x: f64,
    pub y: f64,
}
#[wasm_bindgen]
impl Vec2 {
    #[wasm_bindgen(constructor)]
    pub fn new(x: f64, y: f64) -> Self {
        Self { x, y }
    }
    pub fn distance_from(&self, other: Vec2) -> f64 {
        f64::sqrt(f64::powi(self.x - other.x, 2) + f64::powi(self.y - other.y, 2))
    }
}
impl ops::Add for Vec2 {
    type Output = Vec2;
    fn add(self, rhs: Self) -> Self::Output {
        Vec2 {
            x: self.x + rhs.x,
            y: self.y + rhs.y,
        }
    }
}
impl ops::Sub for Vec2 {
    type Output = Vec2;
    fn sub(self, rhs: Self) -> Self::Output {
        Vec2 {
            x: self.x - rhs.x,
            y: self.y - rhs.y,
        }
    }
}
impl ops::AddAssign for Vec2 {
    fn add_assign(&mut self, other: Self) {
        *self = Self {
            x: self.x + other.x,
            y: self.y + other.y,
        };
    }
}
impl ops::DivAssign<f64> for Vec2 {
    fn div_assign(&mut self, d: f64) {
        self.x /= d;
        self.y /= d;
    }
}
impl ops::Mul<f64> for Vec2 {
    type Output = Self;
    fn mul(self, m: f64) -> Self {
        Self::new(self.x * m, self.y * m)
    }
}
impl ops::Div<f64> for Vec2 {
    type Output = Self;
    fn div(self, m: f64) -> Self {
        Self::new(self.x / m, self.y / m)
    }
}

#[wasm_bindgen]
#[derive(Serialize, Deserialize, PartialEq, Clone)]
pub struct Trail {
    pub pos: Vec3,
    pub color: u32,
}

#[wasm_bindgen]
#[derive(Serialize, Deserialize, PartialEq, Clone)]
pub struct Planet {
    pub pos: Vec3,
    pub vel: Vec3,
    pub acc: Vec3,
    trail: Vec<Trail>,
    pub radius: f32,
    pub mass: f64,
    pub color: u32,
}
#[wasm_bindgen]
impl Planet {
    #[wasm_bindgen(constructor)]
    pub fn new(
        px: f64,
        py: f64,
        pz: f64,
        radius: f32,
        mass: f64,
        color: u32,
        vx: f64,
        vy: f64,
        vz: f64
    ) -> Planet {
        Planet {
            pos: Vec3::new(px, py, pz),
            vel: Vec3::new(vx, vy, vz),
            acc: Vec3::new(0.0, 0.0, 0.0),
            radius,
            mass,
            color,
            trail: vec![],
        }
    }

    pub fn new_simple(px: f64, py: f64, pz: f64, radius: f32, mass: f64, color: u32) -> Planet {
        Planet {
            pos: Vec3::new(px, py, pz),
            vel: Vec3::new(0.0, 0.0, 0.0),
            acc: Vec3::new(0.0, 0.0, 0.0),
            radius,
            mass,
            color,
            trail: vec![],
        }
    }
    pub fn get_trail(&self) -> Vec<Trail> {
        self.trail.clone()
    }

    pub fn add_trail_point(&mut self, pos: Vec3, color: u32, max: usize) {
        self.trail.push(Trail { pos, color });
        if self.trail.len() > max {
            self.trail.remove(0);
        }
    }

    pub fn get_data(&self) -> JsValue {
        serde_wasm_bindgen::to_value(&self).unwrap()
    }
}

#[wasm_bindgen]
#[derive(Serialize, Deserialize, Clone, Default)]
pub struct QuadTreeNode {
    mass: f64,
    center_of_mass: Vec2,
    dimensions: Vec2,
    center: Vec2,
    children: Option<[Box<QuadTreeNode>; 4]>,
    planets: Vec<Planet>,
}

// Implement methods for the QuadTreeNode
#[wasm_bindgen]
impl QuadTreeNode {
    fn new(dimensions: Vec2, center: Vec2) -> QuadTreeNode {
        QuadTreeNode {
            mass: 0.0,
            center_of_mass: Vec2::new(0.0, 0.0),
            dimensions,
            center,
            children: None,
            planets: Vec::with_capacity(2),
        }
    }

    fn add_planet(&mut self, planet: &Planet) {
        if self.children.is_none() {
            self.planets.push(planet.clone());
            if self.planets.len() > 1 {
                self.subdivide();
            }
        } else {
            let quadrant: usize = self.get_quadrant(&Vec2::new(planet.pos.x, planet.pos.y));
            if let Some(children) = &mut self.children {
                children[quadrant].add_planet(planet);
            }
        }
    }

    fn subdivide(&mut self) {
        if self.planets.is_empty() {
            return;
        }
        let new_dimensions: Vec2 = Vec2::new(self.dimensions.x / 2.0, self.dimensions.y / 2.0);
        let child_centers: [Vec2; 4] = [
            self.center + Vec2::new(new_dimensions.x / 2.0, new_dimensions.y / 2.0),
            self.center + Vec2::new(-new_dimensions.x / 2.0, new_dimensions.y / 2.0),
            self.center + Vec2::new(-new_dimensions.x / 2.0, -new_dimensions.y / 2.0),
            self.center + Vec2::new(new_dimensions.x / 2.0, -new_dimensions.y / 2.0),
        ];
        let mut children: [Box<QuadTreeNode>; 4] = Default::default();
        for i in 0..4 {
            children[i] = Box::new(QuadTreeNode::new(new_dimensions, child_centers[i]));
        }
        for planet in &self.planets {
            let quadrant: usize = self.get_quadrant(&Vec2::new(planet.pos.x, planet.pos.y));
            children[quadrant].add_planet(planet);
        }
        self.children = Some(children);
        self.planets.clear();
    }

    fn get_quadrant(&self, position: &Vec2) -> usize {
        if position.x >= self.center.x && position.y >= self.center.y {
            0
        } else if position.x <= self.center.x && position.y >= self.center.y {
            1
        } else if position.x <= self.center.x && position.y <= self.center.y {
            2
        } else {
            3
        }
    }

    fn update_center_of_mass(&mut self) {
        if self.planets.len() == 1 {
            self.mass = self.planets[0].mass;
            self.center_of_mass = Vec2::new(self.planets[0].pos.x, self.planets[0].pos.y);
        } else if let Some(children) = &mut self.children {
            for child in children.iter_mut() {
                child.update_center_of_mass();
                self.mass += child.mass;
                self.center_of_mass += child.center_of_mass * child.mass;
            }
            if self.mass > 0.0 {
                self.center_of_mass /= self.mass;
            }
        } else {
            self.mass = 0.0;
            self.center_of_mass = Vec2::new(0.0, 0.0);
        }
    }

    fn rebuild(&mut self, planets: &Vec<Planet>, dimensions: Vec2, center: Vec2) {
        *self = QuadTreeNode::new(dimensions, center);
        for planet in planets {
            self.add_planet(planet);
        }
        self.update_center_of_mass();
    }

    pub fn get_data(&self) -> JsValue {
        serde_wasm_bindgen::to_value(&self).unwrap()
    }
}

#[wasm_bindgen]
#[derive(Serialize, Deserialize, Clone, Copy, PartialEq)]
pub enum Implementation {
    Euler,
    RK4,
    Verlet, // Verlet integration (position-based)
    Leapfrog, // Leapfrog integration (velocity half-steps)
}

#[wasm_bindgen]
#[derive(Serialize, Deserialize, Clone)]
pub struct Universe {
    planets: Vec<Planet>,
    gravity: f64,
    mass_calculation: bool,
    show_trails: bool,
    is_paused: bool,
    implementation: Implementation,
    speed: f64,
    default_mass: f64,
    use_quadtree: bool,
    quadtree_theta: f64,
    quadtree: QuadTreeNode,
    quadtree_threshold: usize, // Minimum planets to use quadtree
}
#[wasm_bindgen]
impl Universe {
    #[wasm_bindgen(constructor)]
    pub fn new() -> Universe {
        // panic::set_hook(Box::new(console_error_panic_hook::hook));
        // wasm_logger::init(wasm_logger::Config::default());
        // log::info!("Universe Init!");
        //init - Closer 3-body system (scaled for 2D rendering)
        // Positions and velocities scaled by 200 for better visibility in 2D
        let planet1 = Planet::new(
            -160.0,
            0.0,
            -120.0,
            10.0,
            100000.0,
            0xff0000,
            0.0,
            200.0,
            -400.0
        );
        let planet2 = Planet::new(
            60.0,
            120.0,
            140.0,
            10.0,
            100000.0,
            0x0000ff,
            -260.0,
            -15.0,
            20.0
        );
        let planet3 = Planet::new(
            120.0,
            -120.0,
            20.0,
            10.0,
            100000.0,
            0x00ff00,
            260.0,
            -15.0,
            50.0
        );
        let universe = Universe {
            planets: vec![planet1, planet2, planet3],
            gravity: 6.6743e3,
            implementation: Implementation::Euler,
            speed: 1.0 / 20.0,
            mass_calculation: true,
            show_trails: true,
            is_paused: false,
            default_mass: 100000.0, // Default mass used when mass_calculation is false
            use_quadtree: false,
            quadtree_theta: 0.5,
            quadtree: QuadTreeNode::new(Vec2::new(2000.0, 2000.0), Vec2::new(0.0, 0.0)),
            quadtree_threshold: 150, // Use quadtree when 150+ planets
        };
        universe
    }
    pub fn time_step(&mut self, dt: f64) -> u8 {
        if self.planets.is_empty() || self.is_paused {
            return 1;
        }

        // Removed max_planets limit - no truncation

        // Calculate the effective speed multiplier
        let speed_multiplier = self.speed * 2.0;

        // Instead of scaling dt directly (which causes instability at high speeds),
        // we take multiple smaller steps to maintain numerical stability
        let steps = (speed_multiplier.abs() * 50.0).ceil().max(1.0) as usize;
        let sub_dt = (dt * speed_multiplier) / (steps as f64);

        // Perform multiple substeps with smaller dt
        for _ in 0..steps {
            let result = self.single_physics_step(sub_dt);
            if result != 0 {
                return result; // Early exit if NaN detected
            }
        }

        // Add trail points only once per frame (not per substep)
        if self.show_trails {
            for planet in &mut self.planets {
                planet.add_trail_point(planet.pos, planet.color, 250);
            }
        }
        return 0;
    }

    fn single_physics_step(&mut self, dt: f64) -> u8 {
        if self.implementation == Implementation::Euler {
            // Calculate gravitational accelerations for all planets
            let accelerations = if self.use_quadtree {
                self.calculate_gravitational_accelerations_quadtree()
            } else {
                self.calculate_gravitational_accelerations()
            };

            // Check for NaN before updating
            // prettier-ignore
            if accelerations.iter().any(|acc| acc.x.is_nan() || acc.y.is_nan() || acc.z.is_nan()) {
                return 1;
            }

            // Euler integration: v = v + a*dt, then x = x + v*dt
            for i in 0..self.planets.len() {
                // Update velocities
                self.planets[i].vel.x += accelerations[i].x * dt;
                self.planets[i].vel.y += accelerations[i].y * dt;
                self.planets[i].vel.z += accelerations[i].z * dt;

                // Update positions
                self.planets[i].pos.x += self.planets[i].vel.x * dt;
                self.planets[i].pos.y += self.planets[i].vel.y * dt;
                self.planets[i].pos.z += self.planets[i].vel.z * dt;

                // Store acceleration for potential use elsewhere
                self.planets[i].acc = accelerations[i];
            }
        } else if self.implementation == Implementation::RK4 {
            // Store initial positions and velocities
            let initial_positions: Vec<Vec3> = self.planets
                .iter()
                .map(|p| p.pos)
                .collect();
            let initial_velocities: Vec<Vec3> = self.planets
                .iter()
                .map(|p| p.vel)
                .collect();

            // k1: derivatives at current state
            let k1_accel = self.calculate_gravitational_accelerations_for_state(
                &initial_positions,
                &initial_velocities
            );
            let k1_vel = initial_velocities.clone();

            // k2: derivatives at midpoint with k1
            let mut k2_positions = Vec::with_capacity(self.planets.len());
            let mut k2_velocities = Vec::with_capacity(self.planets.len());
            for i in 0..self.planets.len() {
                k2_positions.push(
                    Vec3::new(
                        initial_positions[i].x + k1_vel[i].x * dt * 0.5,
                        initial_positions[i].y + k1_vel[i].y * dt * 0.5,
                        initial_positions[i].z + k1_vel[i].z * dt * 0.5
                    )
                );
                k2_velocities.push(
                    Vec3::new(
                        initial_velocities[i].x + k1_accel[i].x * dt * 0.5,
                        initial_velocities[i].y + k1_accel[i].y * dt * 0.5,
                        initial_velocities[i].z + k1_accel[i].z * dt * 0.5
                    )
                );
            }
            let k2_accel = self.calculate_gravitational_accelerations_for_state(
                &k2_positions,
                &k2_velocities
            );

            // k3: derivatives at midpoint with k2
            let mut k3_positions = Vec::with_capacity(self.planets.len());
            let mut k3_velocities = Vec::with_capacity(self.planets.len());
            for i in 0..self.planets.len() {
                k3_positions.push(
                    Vec3::new(
                        initial_positions[i].x + k2_velocities[i].x * dt * 0.5,
                        initial_positions[i].y + k2_velocities[i].y * dt * 0.5,
                        initial_positions[i].z + k2_velocities[i].z * dt * 0.5
                    )
                );
                k3_velocities.push(
                    Vec3::new(
                        initial_velocities[i].x + k2_accel[i].x * dt * 0.5,
                        initial_velocities[i].y + k2_accel[i].y * dt * 0.5,
                        initial_velocities[i].z + k2_accel[i].z * dt * 0.5
                    )
                );
            }
            let k3_accel = self.calculate_gravitational_accelerations_for_state(
                &k3_positions,
                &k3_velocities
            );

            // k4: derivatives at endpoint with k3
            let mut k4_positions = Vec::with_capacity(self.planets.len());
            let mut k4_velocities = Vec::with_capacity(self.planets.len());
            for i in 0..self.planets.len() {
                k4_positions.push(
                    Vec3::new(
                        initial_positions[i].x + k3_velocities[i].x * dt,
                        initial_positions[i].y + k3_velocities[i].y * dt,
                        initial_positions[i].z + k3_velocities[i].z * dt
                    )
                );
                k4_velocities.push(
                    Vec3::new(
                        initial_velocities[i].x + k3_accel[i].x * dt,
                        initial_velocities[i].y + k3_accel[i].y * dt,
                        initial_velocities[i].z + k3_accel[i].z * dt
                    )
                );
            }
            let k4_accel = self.calculate_gravitational_accelerations_for_state(
                &k4_positions,
                &k4_velocities
            );

            // Check for NaN
            // prettier-ignore
            if
                k1_accel.iter().any(|a| a.x.is_nan() || a.y.is_nan() || a.z.is_nan()) ||
                k2_accel.iter().any(|a| a.x.is_nan() || a.y.is_nan() || a.z.is_nan()) ||
                k3_accel.iter().any(|a| a.x.is_nan() || a.y.is_nan() || a.z.is_nan()) ||
                k4_accel.iter().any(|a| a.x.is_nan() || a.y.is_nan() || a.z.is_nan())
            {
                return 1;
            }

            // Final RK4 update: (k1 + 2*k2 + 2*k3 + k4) / 6
            for i in 0..self.planets.len() {
                self.planets[i].pos.x +=
                    ((k1_vel[i].x +
                        2.0 * k2_velocities[i].x +
                        2.0 * k3_velocities[i].x +
                        k4_velocities[i].x) *
                        dt) /
                    6.0;
                self.planets[i].pos.y +=
                    ((k1_vel[i].y +
                        2.0 * k2_velocities[i].y +
                        2.0 * k3_velocities[i].y +
                        k4_velocities[i].y) *
                        dt) /
                    6.0;
                self.planets[i].pos.z +=
                    ((k1_vel[i].z +
                        2.0 * k2_velocities[i].z +
                        2.0 * k3_velocities[i].z +
                        k4_velocities[i].z) *
                        dt) /
                    6.0;

                self.planets[i].vel.x +=
                    ((k1_accel[i].x + 2.0 * k2_accel[i].x + 2.0 * k3_accel[i].x + k4_accel[i].x) *
                        dt) /
                    6.0;
                self.planets[i].vel.y +=
                    ((k1_accel[i].y + 2.0 * k2_accel[i].y + 2.0 * k3_accel[i].y + k4_accel[i].y) *
                        dt) /
                    6.0;
                self.planets[i].vel.z +=
                    ((k1_accel[i].z + 2.0 * k2_accel[i].z + 2.0 * k3_accel[i].z + k4_accel[i].z) *
                        dt) /
                    6.0;

                // Store final acceleration
                self.planets[i].acc = k1_accel[i];
            }
        } else if self.implementation == Implementation::Verlet {
            // Verlet integration (position-based)
            // Based on: x(t+dt) = x(t) + v(t)*dt + 0.5*a(t)*dt^2
            // Then: v(t+dt) = v(t) + 0.5*(a(t) + a(t+dt))*dt

            // Calculate current accelerations
            let accelerations = self.calculate_gravitational_accelerations();
            // prettier-ignore
            if accelerations.iter().any(|acc| acc.x.is_nan() || acc.y.is_nan() || acc.z.is_nan()) {
                return 1;
            }

            // Update positions: x_new = x + v*dt + 0.5*a*dt^2
            let mut new_positions = Vec::with_capacity(self.planets.len());
            for i in 0..self.planets.len() {
                new_positions.push(
                    Vec3::new(
                        self.planets[i].pos.x +
                            self.planets[i].vel.x * dt +
                            0.5 * accelerations[i].x * dt * dt,
                        self.planets[i].pos.y +
                            self.planets[i].vel.y * dt +
                            0.5 * accelerations[i].y * dt * dt,
                        self.planets[i].pos.z +
                            self.planets[i].vel.z * dt +
                            0.5 * accelerations[i].z * dt * dt
                    )
                );
            }

            // Calculate new accelerations at new positions
            let new_accelerations = self.calculate_gravitational_accelerations_for_state(
                &new_positions,
                &self.planets
                    .iter()
                    .map(|p| p.vel)
                    .collect::<Vec<_>>()
            );
            // prettier-ignore
            if
                new_accelerations
                    .iter()
                    .any(|acc| acc.x.is_nan() || acc.y.is_nan() || acc.z.is_nan())
            {
                return 1;
            }

            // Update velocities: v_new = v + 0.5*(a_old + a_new)*dt
            for i in 0..self.planets.len() {
                self.planets[i].vel.x += 0.5 * (accelerations[i].x + new_accelerations[i].x) * dt;
                self.planets[i].vel.y += 0.5 * (accelerations[i].y + new_accelerations[i].y) * dt;
                self.planets[i].vel.z += 0.5 * (accelerations[i].z + new_accelerations[i].z) * dt;

                // Update positions
                self.planets[i].pos = new_positions[i];

                // Store acceleration
                self.planets[i].acc = new_accelerations[i];
            }
        } else if self.implementation == Implementation::Leapfrog {
            // Leapfrog integration (velocity half-steps)
            // Based on: v(t+dt/2) = v(t) + a(t)*dt/2
            //           x(t+dt) = x(t) + v(t+dt/2)*dt
            //           a(t+dt) = acceleration at new position
            //           v(t+dt) = v(t+dt/2) + a(t+dt)*dt/2

            // Step 1: Calculate initial accelerations
            let accelerations = self.calculate_gravitational_accelerations();

            // Check for NaN before updating
            // prettier-ignore
            if accelerations.iter().any(|acc| acc.x.is_nan() || acc.y.is_nan() || acc.z.is_nan()) {
                return 1;
            }

            // Step 2: Half-step velocity update
            let mut velocities_half = Vec::with_capacity(self.planets.len());
            for i in 0..self.planets.len() {
                velocities_half.push(
                    Vec3::new(
                        self.planets[i].vel.x + accelerations[i].x * (dt / 2.0),
                        self.planets[i].vel.y + accelerations[i].y * (dt / 2.0),
                        self.planets[i].vel.z + accelerations[i].z * (dt / 2.0)
                    )
                );
            }

            // Step 3: Full-step position update using half-step velocity
            let mut new_positions = Vec::with_capacity(self.planets.len());
            for i in 0..self.planets.len() {
                new_positions.push(
                    Vec3::new(
                        self.planets[i].pos.x + velocities_half[i].x * dt,
                        self.planets[i].pos.y + velocities_half[i].y * dt,
                        self.planets[i].pos.z + velocities_half[i].z * dt
                    )
                );
            }

            // Step 4: Calculate accelerations at new positions
            let new_accelerations = self.calculate_gravitational_accelerations_for_state(
                &new_positions,
                &velocities_half
            );
            // prettier-ignore
            if
                new_accelerations
                    .iter()
                    .any(|acc| acc.x.is_nan() || acc.y.is_nan() || acc.z.is_nan())
            {
                return 1;
            }

            // Step 5: Complete velocity update with second half-step
            for i in 0..self.planets.len() {
                self.planets[i].pos = new_positions[i];
                self.planets[i].vel.x = velocities_half[i].x + new_accelerations[i].x * (dt / 2.0);
                self.planets[i].vel.y = velocities_half[i].y + new_accelerations[i].y * (dt / 2.0);
                self.planets[i].vel.z = velocities_half[i].z + new_accelerations[i].z * (dt / 2.0);

                // Store acceleration
                self.planets[i].acc = new_accelerations[i];
            }
        }

        return 0;
    }
    // Calculate gravitational accelerations for a given set of planet positions and masses
    // Used for RK4 integration with intermediate states
    fn calculate_gravitational_accelerations_for_state(
        &self,
        positions: &[Vec3],
        _velocities: &[Vec3]
    ) -> Vec<Vec3> {
        let n = positions.len();
        let mut accelerations = vec![Vec3::new(0.0, 0.0, 0.0); n];

        // Calculate gravitational forces between all pairs of planets
        for i in 0..n {
            let mass_i = if self.mass_calculation {
                self.planets[i].mass
            } else {
                self.default_mass
            };

            for j in 0..n {
                if i != j {
                    let mass_j = if self.mass_calculation {
                        self.planets[j].mass
                    } else {
                        self.default_mass
                    };

                    // Vector from planet i to planet j
                    let dx = positions[j].x - positions[i].x;
                    let dy = positions[j].y - positions[i].y;
                    let dz = positions[j].z - positions[i].z;

                    // Distance between planets
                    let distance_squared = dx * dx + dy * dy + dz * dz;
                    let distance = f64::sqrt(distance_squared);

                    // Avoid division by zero and singularities
                    if distance > 1e-4 {
                        // Gravitational force magnitude: F = G * m1 * m2 / r^2
                        let force_magnitude = (self.gravity * mass_i * mass_j) / distance_squared;

                        // Unit vector from i to j
                        let unit_x = dx / distance;
                        let unit_y = dy / distance;
                        let unit_z = dz / distance;

                        // Acceleration = Force / mass (for planet i)
                        let acc_magnitude = force_magnitude / mass_i;

                        // Add acceleration components to planet i (pointing toward planet j)
                        accelerations[i].x += acc_magnitude * unit_x;
                        accelerations[i].y += acc_magnitude * unit_y;
                        accelerations[i].z += acc_magnitude * unit_z;
                    }
                }
            }
        }

        accelerations
    }

    // Calculate acceleration from a quadtree node (Barnes-Hut approximation)
    fn acceleration_from_quad(
        &self,
        planet_pos: Vec2,
        planet_mass: f64,
        quad: &QuadTreeNode
    ) -> Vec2 {
        if quad.mass == 0.0 {
            return Vec2::new(0.0, 0.0);
        }

        let dx = quad.center_of_mass.x - planet_pos.x;
        let dy = quad.center_of_mass.y - planet_pos.y;
        let distance = f64::sqrt(dx * dx + dy * dy);

        if distance < 1e-10 {
            return Vec2::new(0.0, 0.0);
        }

        // Calculate the ratio: size / distance
        let size = f64::max(quad.dimensions.x, quad.dimensions.y);
        let ratio = size / distance;

        // If ratio < theta, treat as single body (Barnes-Hut criterion)
        if ratio < self.quadtree_theta || quad.children.is_none() {
            // Calculate gravitational acceleration: a = G * m / r²
            let distance_squared = distance * distance;
            let force_magnitude = (self.gravity * quad.mass) / distance_squared;

            // Unit vector from planet to quad center of mass
            let unit_x = dx / distance;
            let unit_y = dy / distance;

            Vec2::new(force_magnitude * unit_x, force_magnitude * unit_y)
        } else {
            // Recursively calculate from children
            let mut acc = Vec2::new(0.0, 0.0);
            if let Some(children) = &quad.children {
                for child in children.iter() {
                    acc += self.acceleration_from_quad(planet_pos, planet_mass, child);
                }
            }
            acc
        }
    }

    // Calculate gravitational accelerations using quadtree (Barnes-Hut)
    fn calculate_gravitational_accelerations_quadtree(&mut self) -> Vec<Vec3> {
        let n = self.planets.len();
        let mut accelerations = vec![Vec3::new(0.0, 0.0, 0.0); n];

        // Rebuild quadtree
        let mut min = Vec2::new(f64::MAX, f64::MAX);
        let mut max = Vec2::new(f64::MIN, f64::MIN);

        for planet in &self.planets {
            if planet.pos.x < min.x {
                min.x = planet.pos.x;
            }
            if planet.pos.y < min.y {
                min.y = planet.pos.y;
            }
            if planet.pos.x > max.x {
                max.x = planet.pos.x;
            }
            if planet.pos.y > max.y {
                max.y = planet.pos.y;
            }
        }

        let dimensions = max - min;
        let center = min + dimensions * 0.5;
        self.quadtree.rebuild(&self.planets, dimensions, center);

        // Calculate accelerations using quadtree
        for i in 0..n {
            let planet_pos = Vec2::new(self.planets[i].pos.x, self.planets[i].pos.y);
            let mass = if self.mass_calculation { self.planets[i].mass } else { self.default_mass };

            let acc_2d = self.acceleration_from_quad(planet_pos, mass, &self.quadtree);
            accelerations[i].x = acc_2d.x;
            accelerations[i].y = acc_2d.y;
            accelerations[i].z = 0.0;
        }

        accelerations
    }

    // Calculate gravitational accelerations for all planets
    // Returns acceleration vectors for each planet based on gravitational forces from all others
    fn calculate_gravitational_accelerations(&self) -> Vec<Vec3> {
        let n = self.planets.len();
        let mut accelerations = vec![Vec3::new(0.0, 0.0, 0.0); n];

        // Calculate gravitational forces between all pairs of planets
        for i in 0..n {
            let mass_i = if self.mass_calculation {
                self.planets[i].mass
            } else {
                self.default_mass
            };

            for j in 0..n {
                if i != j {
                    let mass_j = if self.mass_calculation {
                        self.planets[j].mass
                    } else {
                        self.default_mass
                    };

                    // Vector from planet i to planet j
                    let dx = self.planets[j].pos.x - self.planets[i].pos.x;
                    let dy = self.planets[j].pos.y - self.planets[i].pos.y;
                    let dz = self.planets[j].pos.z - self.planets[i].pos.z;

                    // Distance between planets
                    let distance_squared = dx * dx + dy * dy + dz * dz;
                    let distance = f64::sqrt(distance_squared);

                    // Avoid division by zero and singularities
                    if distance > 1e-10 {
                        // Gravitational force magnitude: F = G * m1 * m2 / r^2
                        // Here self.gravity is our gravitational constant
                        let force_magnitude = (self.gravity * mass_i * mass_j) / distance_squared;

                        // Unit vector from i to j
                        let unit_x = dx / distance;
                        let unit_y = dy / distance;
                        let unit_z = dz / distance;

                        // Acceleration = Force / mass (for planet i)
                        let acc_magnitude = force_magnitude / mass_i;

                        // Add acceleration components to planet i (pointing toward planet j)
                        accelerations[i].x += acc_magnitude * unit_x;
                        accelerations[i].y += acc_magnitude * unit_y;
                        accelerations[i].z += acc_magnitude * unit_z;
                    }
                }
            }
        }

        accelerations
    }
    pub fn reset(&mut self) {
        *self = Universe::new();
    }
    pub fn add_planet(
        &mut self,
        px: f64,
        py: f64,
        pz: f64,
        vx: f64,
        vy: f64,
        vz: f64,
        radius: f32,
        mass: f64,
        color: u32
    ) {
        let planet = Planet::new(px, py, pz, radius, mass, color, vx, vy, vz);
        self.planets.push(planet);
    }

    pub fn random_color() -> u32 {
        // Generate a random color in ff0000,0000ff,00ff00,f0f000,00f0f0,f000f0
        let colors = [0xff0000, 0x0000ff, 0x00ff00, 0xf0f000, 0x00f0f0, 0xf000f0];
        colors[rand::rng().random_range(0..colors.len())]
    }
    pub fn add_planet_simple(&mut self, px: f64, py: f64, pz: f64) {
        let default_color = Self::random_color();
        let default_radius = 10.0;

        self.planets.push(
            Planet::new_simple(px, py, pz, default_radius, self.default_mass, default_color)
        );
    }
    pub fn remove_planet(&mut self) {
        self.planets.pop();
    }
    pub fn get_planets(&self) -> JsValue {
        serde_wasm_bindgen::to_value(&self.planets).unwrap()
    }

    pub fn get_planet(&self, index: usize) -> Option<Planet> {
        self.planets.get(index).cloned()
    }
    pub fn get_planet_count(&self) -> i32 {
        self.planets.len() as i32
    }

    pub fn update_planet_position(&mut self, index: usize, x: f64, y: f64, z: f64) {
        if index < self.planets.len() {
            self.planets[index].pos = Vec3::new(x, y, z);
        }
    }

    pub fn update_planet_velocity(&mut self, index: usize, vx: f64, vy: f64, vz: f64) {
        if index < self.planets.len() {
            self.planets[index].vel = Vec3::new(vx, vy, vz);
        }
    }

    pub fn update_planet_mass(&mut self, index: usize, mass: f64) {
        if index < self.planets.len() {
            self.planets[index].mass = mass;
        }
    }

    pub fn update_planet_color(&mut self, index: usize, color: u32) {
        if index < self.planets.len() {
            self.planets[index].color = color;
        }
    }

    pub fn update_planet_radius(&mut self, index: usize, radius: f32) {
        if index < self.planets.len() {
            self.planets[index].radius = radius;
        }
    }

    pub fn update_planet_acceleration(&mut self, index: usize, ax: f64, ay: f64, az: f64) {
        if index < self.planets.len() {
            self.planets[index].acc = Vec3::new(ax, ay, az);
        }
    }

    pub fn get_trails(&self) -> JsValue {
        if self.show_trails {
            let trails: Vec<Vec<Trail>> = self.planets
                .iter()
                .map(|planet| planet.trail.clone())
                .collect();
            serde_wasm_bindgen::to_value(&trails).unwrap()
        } else {
            let trails: Vec<Vec<Trail>> = vec![];
            serde_wasm_bindgen::to_value(&trails).unwrap()
        }
    }
    pub fn set_gravity(&mut self, gravity: f64) {
        self.gravity = gravity;
    }
    pub fn get_gravity(&self) -> f64 {
        return self.gravity;
    }
    pub fn set_speed(&mut self, speed: f64) {
        self.speed = speed;
    }
    pub fn get_speed(&self) -> f64 {
        return self.speed;
    }

    pub fn set_is_paused(&mut self, is_paused: bool) {
        self.is_paused = is_paused;
    }

    pub fn get_is_paused(&self) -> bool {
        return self.is_paused;
    }

    pub fn set_implementation(&mut self, implementation: Implementation) {
        self.implementation = implementation;
    }
    pub fn get_implementation(&self) -> Implementation {
        return self.implementation;
    }

    pub fn set_mass_calculation(&mut self, mass_calculation: bool) {
        self.mass_calculation = mass_calculation;
    }

    pub fn get_mass_calculation(&self) -> bool {
        return self.mass_calculation;
    }

    pub fn toggle_mass_calculation(&mut self) {
        self.mass_calculation = !self.mass_calculation;
    }

    pub fn set_show_trails(&mut self, show_trails: bool) {
        self.show_trails = show_trails;
    }

    pub fn get_show_trails(&self) -> bool {
        return self.show_trails;
    }

    pub fn toggle_show_trails(&mut self) {
        self.show_trails = !self.show_trails;
    }

    pub fn set_use_quadtree(&mut self, use_quadtree: bool) {
        self.use_quadtree = use_quadtree;
    }

    pub fn get_use_quadtree(&self) -> bool {
        return self.use_quadtree;
    }

    pub fn toggle_use_quadtree(&mut self) {
        self.use_quadtree = !self.use_quadtree;
    }

    pub fn set_quadtree_theta(&mut self, theta: f64) {
        self.quadtree_theta = theta;
    }

    pub fn get_quadtree_theta(&self) -> f64 {
        return self.quadtree_theta;
    }

    pub fn get_quadtree(&mut self) -> JsValue {
        // Rebuild quadtree with current planet positions for visualization
        if !self.planets.is_empty() {
            let mut min = Vec2::new(f64::MAX, f64::MAX);
            let mut max = Vec2::new(f64::MIN, f64::MIN);

            for planet in &self.planets {
                if planet.pos.x < min.x {
                    min.x = planet.pos.x;
                }
                if planet.pos.y < min.y {
                    min.y = planet.pos.y;
                }
                if planet.pos.x > max.x {
                    max.x = planet.pos.x;
                }
                if planet.pos.y > max.y {
                    max.y = planet.pos.y;
                }
            }

            // Add some padding to the bounds
            let padding = 100.0;
            min = min - Vec2::new(padding, padding);
            max = max + Vec2::new(padding, padding);

            let dimensions = max - min;
            let center = min + dimensions * 0.5;
            self.quadtree.rebuild(&self.planets, dimensions, center);
        }

        serde_wasm_bindgen::to_value(&self.quadtree).unwrap()
    }
}
