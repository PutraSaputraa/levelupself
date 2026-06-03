# LevelUp Self Firestore Schema

This app currently runs as a local-first prototype and is prepared to sync these
collections to Firebase Auth and Cloud Firestore.

## Collections

### users/{userId}

- name: string
- email: string
- total_xp: number
- level: number
- streak: number
- is_admin: boolean
- last_completed_date: string
- created_at: timestamp

### user_profiles/{userId}

- main_goal: string
- available_time: string
- activity_level: string
- preferred_activities: string[]
- disliked_activities: string[]
- active_time: string
- motivation_style: string
- starting_difficulty: string
- onboarding_completed: boolean

### missions/{missionId}

- title: string
- description: string
- category: string
- difficulty: string
- duration_minutes: number
- xp_reward: number
- energy_required: string
- location: string
- equipment: string
- target_goal: string[]
- created_at: timestamp

### daily_missions/{dailyMissionId}

- user_id: string
- mission_id: string
- date: string
- status: pending | completed | skipped
- slot: utama | ringan | bonus
- recommended_score: number
- reasons: string[]
- completed_at: timestamp | null
- created_at: timestamp

### mission_logs/{logId}

- user_id: string
- mission_id: string
- title: string
- category: string
- status: completed | skipped
- completed: boolean
- skipped: boolean
- rating: number | null
- feedback: string
- duration_actual: number
- recommended_score: number
- time_completed: timestamp | null
- created_at: timestamp

### recommendation_feedback/{feedbackId}

- user_id: string
- mission_id: string
- liked: boolean
- too_easy: boolean
- too_hard: boolean
- boring: boolean
- want_more_like_this: boolean
- created_at: timestamp

### badges/{badgeId}

- name: string
- description: string
- requirement_type: string
- requirement_value: number

### user_badges/{userBadgeId}

- user_id: string
- badge_id: string
- earned_at: timestamp
