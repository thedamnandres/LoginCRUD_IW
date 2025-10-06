from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session, joinedload

from app.database import get_db
from app.models.item import Item
from app.views.item_schema import ItemCreate, ItemOut
from app.controllers.auth import get_current_user, require_admin
from app.models.user import User

router = APIRouter()

# Create item
@router.post("/", response_model=ItemOut)
def create_item(
    item: ItemCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    db_item = Item(
        name=item.name,
        description=item.description,
        owner_id=current_user.id
    )
    db.add(db_item)
    db.commit()
    db.refresh(db_item)
    return db_item

# List items for the current user
@router.get("/", response_model=list[ItemOut])
def list_items(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return db.query(Item).options(joinedload(Item.owner)).filter(Item.owner_id == current_user.id).all()

# List all items (admin only)
@router.get("/all", response_model=list[ItemOut])
def list_all_items(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin),
):
    return db.query(Item).options(joinedload(Item.owner)).all()

# Update an item
@router.put("/{item_id}", response_model=ItemOut)
def update_item(
    item_id: int,
    item: ItemCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    db_item = db.query(Item).filter(Item.id == item_id).first()
    if not db_item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Item no encontrado"
        )
    if db_item.owner_id != current_user.id and not current_user.is_superuser:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, detail="No autorizado"
        )

    db_item.name = item.name
    db_item.description = item.description
    db.commit()
    db.refresh(db_item)
    return db_item


# Delete an item
@router.delete("/{item_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_item(
    item_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    db_item = db.query(Item).filter(Item.id == item_id).first()
    if not db_item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Item no encontrado"
        )
    if db_item.owner_id != current_user.id and not current_user.is_superuser:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, detail="No autorizado"
        )

    db.delete(db_item)
    db.commit()
    return None
