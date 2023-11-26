export default class Pathfinding {
    public static create(path: Phaser.Curves.Path, waypoints: Phaser.Math.Vector2[], spawn: Phaser.Math.Vector2, goal: Phaser.Math.Vector2): Phaser.Curves.Path {
        path = new Phaser.Curves.Path(spawn.x, spawn.y);

        waypoints.forEach((waypoint) => {
            path.lineTo(waypoint.x, waypoint.y);
        });

        path!.lineTo(goal.x, goal.y);

        return path;
    }
}