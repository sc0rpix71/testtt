#!/usr/bin/env python3
"""Mini terminal game for PC: Treasure Hunt."""

import random

GRID_SIZE = 5
MAX_TURNS = 20


def create_board(size):
    return [["." for _ in range(size)] for _ in range(size)]


def place_random(size, exclude):
    while True:
        pos = (random.randrange(size), random.randrange(size))
        if pos not in exclude:
            return pos


def clamp(value, min_value, max_value):
    return max(min_value, min(value, max_value))


def render(board, player_pos, visited):
    for r in range(len(board)):
        row = []
        for c in range(len(board)):
            if (r, c) == player_pos:
                row.append("P")
            elif (r, c) in visited:
                row.append("*")
            else:
                row.append(".")
        print(" ".join(row))


def prompt_move():
    while True:
        move = input("Move (WASD) or Q to quit: ").strip().lower()
        if move in {"w", "a", "s", "d", "q"}:
            return move
        print("Invalid input. Use W/A/S/D or Q.")


def main():
    print("Treasure Hunt - Mini PC Game")
    print("Find the treasure in a 5x5 grid. Avoid the trap!")
    print("Legend: P=you, *=visited, .=unknown")

    board = create_board(GRID_SIZE)
    player_pos = (0, 0)
    treasure_pos = place_random(GRID_SIZE, {player_pos})
    trap_pos = place_random(GRID_SIZE, {player_pos, treasure_pos})

    visited = {player_pos}
    turns_left = MAX_TURNS

    while turns_left > 0:
        print(f"\nTurns left: {turns_left}")
        render(board, player_pos, visited)

        move = prompt_move()
        if move == "q":
            print("Thanks for playing!")
            return

        row, col = player_pos
        if move == "w":
            row -= 1
        elif move == "s":
            row += 1
        elif move == "a":
            col -= 1
        elif move == "d":
            col += 1

        row = clamp(row, 0, GRID_SIZE - 1)
        col = clamp(col, 0, GRID_SIZE - 1)
        player_pos = (row, col)
        visited.add(player_pos)
        turns_left -= 1

        if player_pos == treasure_pos:
            print("\nYou found the treasure! You win!")
            render(board, player_pos, visited)
            return
        if player_pos == trap_pos:
            print("\nOh no! You stepped on the trap. Game over.")
            render(board, player_pos, visited)
            return

    print("\nOut of turns! The treasure remains hidden.")
    print(f"Treasure was at: {treasure_pos}")


if __name__ == "__main__":
    main()
